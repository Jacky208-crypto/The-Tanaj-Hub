import { useState, useMemo, useRef, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { places, PLACE_TYPES, TIME_PERIODS } from '../data/places';
import {
  torahBooks, neviimRishonimBooks, neviimAjaranimBooks, ketuvimBooks, getBookById,
} from '../data/books';
import styles from './MapPage.module.css';

class MapErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) {
      return (
        <pre style={{ padding: 20, whiteSpace: 'pre-wrap', color: '#b91c1c', fontSize: 12 }}>
          {String(this.state.err && this.state.err.stack || this.state.err)}
        </pre>
      );
    }
    return this.props.children;
  }
}

const TYPE_META = {
  city:       { color: '#1d3a8a', label: 'City / Town' },
  region:     { color: '#7c3aed', label: 'Region / Nation' },
  mountain:   { color: '#92400e', label: 'Mountain' },
  river:      { color: '#0369a1', label: 'River' },
  water:      { color: '#0d9488', label: 'Sea / Lake' },
  wilderness: { color: '#b45309', label: 'Wilderness' },
};

const BASEMAPS = {
  map: {
    label: 'Map',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  terrain: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap (CC-BY-SA)',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
};

const BOOK_GROUPS = [
  { section: 'Torah', books: torahBooks },
  { section: 'Neviim Rishonim', books: neviimRishonimBooks },
  { section: 'Neviim Ajaronim', books: neviimAjaranimBooks },
  { section: 'Ketuvim', books: ketuvimBooks },
];

function pinIcon(type) {
  const color = (TYPE_META[type] || TYPE_META.city).color;
  return L.divIcon({
    className: styles.pinWrap,
    html: `<span class="${styles.pin}" style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

// Ensures Leaflet recomputes its size once the flex container has settled,
// avoiding the partial-tile render on first paint.
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    const t = setTimeout(fix, 0);
    map.whenReady(fix);
    window.addEventListener('resize', fix);
    return () => { clearTimeout(t); window.removeEventListener('resize', fix); };
  }, [map]);
  return null;
}

// Cluster layer driving leaflet.markercluster directly.
// Built imperatively in an effect so it is safe under React StrictMode
// (mount → cleanup → mount recreates the group cleanly).
function ClusterLayer({ places, selected, onSelect, navigate }) {
  const map = useMap();
  const groupRef = useRef(null);
  const markersRef = useRef(new Map());
  const rootsRef = useRef([]);

  useEffect(() => {
    const group = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 45 });
    const markers = new Map();
    const roots = [];

    for (const p of places) {
      const marker = L.marker([p.lat, p.lng], { icon: pinIcon(p.type) });
      marker.on('click', () => onSelect(p));

      // Render the React popup into a detached node, bound lazily on open.
      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(<PlacePopup place={p} navigate={navigate} />);
      roots.push(root);
      marker.bindPopup(container, { minWidth: 200, maxWidth: 260 });

      markers.set(p.id, marker);
      group.addLayer(marker);
    }

    map.addLayer(group);
    groupRef.current = group;
    markersRef.current = markers;
    rootsRef.current = roots;

    return () => {
      map.removeLayer(group);
      // Defer root unmount to avoid unmounting during React's render phase.
      const toUnmount = roots;
      setTimeout(() => toUnmount.forEach(r => r.unmount()), 0);
      groupRef.current = null;
      markersRef.current = new Map();
      rootsRef.current = [];
    };
  }, [places, map, onSelect, navigate]);

  // Expand cluster to reveal the selected marker, then open its popup.
  useEffect(() => {
    const group = groupRef.current;
    if (!selected || !group) return;
    const marker = markersRef.current.get(selected.id);
    if (!marker) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 9), { duration: 0.7 });
    group.zoomToShowLayer(marker, () => marker.openPopup());
  }, [selected, map]);

  return null;
}

// Fits the map to the filtered set whenever the filter signature changes
function FitBounds({ signature, points }) {
  const map = useMap();
  const last = useRef(null);
  useEffect(() => {
    if (last.current === signature) return;
    last.current = signature;
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10, animate: true });
  }, [signature, points, map]);
  return null;
}

export default function MapPage() {
  return (
    <MapErrorBoundary>
      <MapPageInner />
    </MapErrorBoundary>
  );
}

function MapPageInner() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activePeriods, setActivePeriods] = useState([]);
  const [activeTypes, setActiveTypes] = useState([]);
  const [book, setBook] = useState('');
  const [selected, setSelected] = useState(null);

  const toggle = (setter, list) => (v) =>
    setter(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return places.filter(p => {
      if (q) {
        const hit = p.name.toLowerCase().includes(q) ||
          (p.aliases || []).some(a => a.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (activePeriods.length && !activePeriods.some(pr => p.periods.includes(pr))) return false;
      if (activeTypes.length && !activeTypes.includes(p.type)) return false;
      if (book && !p.books.includes(book)) return false;
      return true;
    });
  }, [search, activePeriods, activeTypes, book]);

  const signature = useMemo(
    () => `${search}|${activePeriods.join(',')}|${activeTypes.join(',')}|${book}`,
    [search, activePeriods, activeTypes, book]
  );

  const hasFilters = search || activePeriods.length || activeTypes.length || book;
  const clearAll = () => { setSearch(''); setActivePeriods([]); setActiveTypes([]); setBook(''); };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className="back-btn" onClick={() => navigate('/')}>← Home</button>
        <h1 className={styles.title}>Biblical Map</h1>
        <span className={styles.count}>{filtered.length} of {places.length} places</span>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <input
            className={styles.searchInput}
            placeholder="Search a place…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Time period</div>
            <div className={styles.chips}>
              {TIME_PERIODS.map(pr => (
                <button
                  key={pr}
                  className={`${styles.chip} ${activePeriods.includes(pr) ? styles.chipOn : ''}`}
                  onClick={() => toggle(setActivePeriods, activePeriods)(pr)}
                >{pr}</button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Type</div>
            <div className={styles.chips}>
              {PLACE_TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.chip} ${activeTypes.includes(t) ? styles.chipOn : ''}`}
                  onClick={() => toggle(setActiveTypes, activeTypes)(t)}
                >
                  <span className={styles.dot} style={{ background: TYPE_META[t].color }} />
                  {TYPE_META[t].label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Book</div>
            <select className={styles.select} value={book} onChange={e => setBook(e.target.value)}>
              <option value="">All books</option>
              {BOOK_GROUPS.map(g => (
                <optgroup key={g.section} label={g.section}>
                  {g.books.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button className={styles.clearBtn} onClick={clearAll}>Clear filters</button>
          )}

          <ul className={styles.resultList}>
            {filtered.map(p => (
              <li
                key={p.id}
                className={`${styles.resultItem} ${selected?.id === p.id ? styles.resultOn : ''}`}
                onClick={() => setSelected(p)}
              >
                <span className={styles.dot} style={{ background: TYPE_META[p.type].color }} />
                <span className={styles.resultName}>{p.name}</span>
                <span className={styles.resultType}>{p.type}</span>
              </li>
            ))}
            {!filtered.length && <li className={styles.empty}>No places match these filters.</li>}
          </ul>
        </aside>

        <div className={styles.mapWrap}>
          <MapContainer center={[31.5, 35.2]} zoom={7} className={styles.map} scrollWheelZoom>
            <BasemapControl />
            <MapResizer />
            <FitBounds signature={signature} points={filtered} />
            <ClusterLayer
              places={filtered}
              selected={selected}
              onSelect={setSelected}
              navigate={navigate}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

// Basemap switcher rendered inside the map so it can swap the TileLayer
function BasemapControl() {
  const [key, setKey] = useState('map');
  const bm = BASEMAPS[key];
  return (
    <>
      <TileLayer key={key} url={bm.url} attribution={bm.attribution} />
      <div className={styles.basemapSwitch}>
        {Object.entries(BASEMAPS).map(([k, v]) => (
          <button
            key={k}
            className={`${styles.basemapBtn} ${k === key ? styles.basemapOn : ''}`}
            onClick={() => setKey(k)}
          >{v.label}</button>
        ))}
      </div>
    </>
  );
}

function PlacePopup({ place, navigate }) {
  const meta = TYPE_META[place.type] || TYPE_META.city;
  return (
    <div className={styles.popup}>
      <div className={styles.popupHead}>
        <span className={styles.dot} style={{ background: meta.color }} />
        <strong>{place.name}</strong>
        <span className={styles.popupType}>{meta.label}</span>
      </div>
      {place.aliases?.length > 0 && (
        <div className={styles.popupAliases}>Also: {place.aliases.join(', ')}</div>
      )}
      {place.comment && <div className={styles.popupComment}>{place.comment}</div>}

      <div className={styles.popupSubhead}>Appears in</div>
      <div className={styles.popupBooks}>
        {place.books.map(id => {
          const b = getBookById(id);
          if (!b) return null;
          return (
            <button key={id} className={styles.bookTag} onClick={() => navigate(`/book/${id}`)}>
              {b.label}
            </button>
          );
        })}
      </div>

      <div className={styles.popupPeriods}>
        {place.periods.map(pr => <span key={pr} className={styles.periodTag}>{pr}</span>)}
      </div>

      {place.refs?.length > 0 && (
        <div className={styles.popupRefs}>{place.refs.join(' · ')}</div>
      )}
    </div>
  );
}
