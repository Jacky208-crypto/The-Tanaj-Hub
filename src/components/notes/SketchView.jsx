import { useId, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { noteStrings } from './noteStrings';
import styles from './RichNote.module.css';

const WIDTH = 800;
const INK = 'currentColor';
const COLORS = [INK, '#e11d48', '#2563eb', '#16a34a', '#ea580c', '#9333ea'];
const TOOLS = [
  { id: 'select', icon: '⬚' },
  { id: 'rect', icon: '▭' },
  { id: 'ellipse', icon: '◯' },
  { id: 'diamond', icon: '◇' },
  { id: 'arrow', icon: '→' },
  { id: 'line', icon: '╱' },
  { id: 'pen', icon: '✎' },
  { id: 'text', icon: 'T' },
];
const BOXES = ['rect', 'ellipse', 'diamond'];
const LINES = ['line', 'arrow'];

const newId = () => Math.random().toString(36).slice(2, 9);

// Normalize a box drawn from any corner.
function box(s) {
  return {
    x: Math.min(s.x1, s.x2), y: Math.min(s.y1, s.y2),
    w: Math.abs(s.x2 - s.x1), h: Math.abs(s.y2 - s.y1),
  };
}

function moved(shape, dx, dy) {
  if (shape.type === 'pen') return { ...shape, points: shape.points.map(([x, y]) => [x + dx, y + dy]) };
  return { ...shape, x1: shape.x1 + dx, y1: shape.y1 + dy, x2: shape.x2 + dx, y2: shape.y2 + dy };
}

function center(shape) {
  if (shape.type === 'text') return { x: shape.x1, y: shape.y1 };
  const b = box(shape);
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
}

// Drawing board for diagrams inside a note (boxes, circles, arrows, pen, text).
export default function SketchView({ node, editor, updateAttributes, deleteNode, extension }) {
  const s = extension.options.strings || noteStrings('english');
  const editable = editor.isEditable;
  const uid = useId().replace(/:/g, '');
  const svgRef = useRef(null);
  const [tool, setTool] = useState('rect');
  const [color, setColor] = useState(INK);
  const [fill, setFill] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null); // shape being drawn
  const [drag, setDrag] = useState(null); // { id, x, y, shapes } while moving a shape
  const [editing, setEditing] = useState(null); // { id, value } label being typed

  const height = node.attrs.height || 320;
  const saved = node.attrs.shapes || [];
  const shapes = drag ? drag.shapes : saved;

  const commit = (next) => updateAttributes({ shapes: next });

  function point(e) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.round(p.x), y: Math.round(p.y) };
  }

  function onBoardDown(e) {
    if (!editable || e.button !== 0) return;
    const p = point(e);
    if (editing) { finishEditing(); return; }
    if (tool === 'select') { setSelectedId(null); return; }
    if (tool === 'text') {
      const shape = { id: newId(), type: 'text', x1: p.x, y1: p.y, x2: p.x, y2: p.y, color, label: '' };
      commit([...saved, shape]);
      setEditing({ id: shape.id, value: '' });
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraft({
      id: newId(), type: tool, color, fill,
      x1: p.x, y1: p.y, x2: p.x, y2: p.y,
      points: tool === 'pen' ? [[p.x, p.y]] : undefined,
    });
  }

  function onBoardMove(e) {
    if (draft) {
      const p = point(e);
      setDraft((d) => (d.type === 'pen'
        ? { ...d, points: [...d.points, [p.x, p.y]] }
        : { ...d, x2: p.x, y2: p.y }));
    } else if (drag) {
      const p = point(e);
      const dx = p.x - drag.x;
      const dy = p.y - drag.y;
      setDrag((d) => ({ ...d, x: p.x, y: p.y, shapes: d.shapes.map((sh) => (sh.id === d.id ? moved(sh, dx, dy) : sh)) }));
    }
  }

  function onBoardUp(e) {
    if (draft) {
      // Use where the pointer was released, in case the last move event was missed.
      const p = point(e);
      const shape = draft.type === 'pen' ? draft : { ...draft, x2: p.x, y2: p.y };
      const b = box(shape);
      const tooSmall = shape.type === 'pen' ? shape.points.length < 2 : b.w < 4 && b.h < 4;
      if (!tooSmall) commit([...saved, shape]);
      setDraft(null);
    } else if (drag) {
      const p = point(e);
      const dx = p.x - drag.x;
      const dy = p.y - drag.y;
      const next = drag.shapes.map((sh) => (sh.id === drag.id ? moved(sh, dx, dy) : sh));
      if (dx || dy || drag.shapes !== saved) commit(next); // a plain click moves nothing
      setDrag(null);
    }
  }

  function onShapeDown(e, shape) {
    if (!editable || tool !== 'select') return;
    // No pointer capture here: it would swallow the double-click that edits a label.
    e.stopPropagation();
    const p = point(e);
    setSelectedId(shape.id);
    setDrag({ id: shape.id, x: p.x, y: p.y, shapes: saved });
  }

  function onShapeDouble(e, shape) {
    if (!editable || !(BOXES.includes(shape.type) || shape.type === 'text')) return;
    e.stopPropagation();
    setEditing({ id: shape.id, value: shape.label || '' });
  }

  function finishEditing() {
    if (!editing) return;
    const value = editing.value.trim();
    const next = saved
      .map((sh) => (sh.id === editing.id ? { ...sh, label: value } : sh))
      .filter((sh) => sh.type !== 'text' || sh.label);
    commit(next);
    setEditing(null);
  }

  function removeSelected() {
    if (!selectedId) return;
    commit(saved.filter((sh) => sh.id !== selectedId));
    setSelectedId(null);
  }

  function onKeyDown(e) {
    if (editing) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
      e.preventDefault();
      removeSelected();
    }
  }

  const marker = (c) => `url(#${uid}-arrow-${COLORS.indexOf(c)})`;

  function renderShape(sh) {
    const stroke = sh.color || INK;
    const fillColor = sh.fill ? stroke : 'none';
    const common = {
      stroke,
      strokeWidth: 2.5,
      fill: fillColor,
      fillOpacity: sh.fill ? 0.15 : undefined,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    };
    const selected = sh.id === selectedId;
    const events = {
      // Grab boxes by their inside too, not just the outline.
      pointerEvents: 'all',
      onPointerDown: (e) => onShapeDown(e, sh),
      onDoubleClick: (e) => onShapeDouble(e, sh),
      className: `${styles.shape} ${selected ? styles.shapeSelected : ''} ${tool === 'select' && editable ? styles.shapeMovable : ''}`,
    };
    const label = sh.label && editing?.id !== sh.id && (
      <text x={center(sh).x} y={center(sh).y} fill={stroke} className={styles.shapeLabel} dominantBaseline="middle" textAnchor="middle">
        {sh.label}
      </text>
    );

    if (sh.type === 'pen') {
      const d = sh.points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
      return <path key={sh.id} d={d} {...common} fill="none" {...events} />;
    }
    if (LINES.includes(sh.type)) {
      return (
        <g key={sh.id} {...events}>
          <line x1={sh.x1} y1={sh.y1} x2={sh.x2} y2={sh.y2} stroke="transparent" strokeWidth={14} />
          <line x1={sh.x1} y1={sh.y1} x2={sh.x2} y2={sh.y2} {...common} markerEnd={sh.type === 'arrow' ? marker(stroke) : undefined} />
        </g>
      );
    }
    if (sh.type === 'text') {
      return (
        <g key={sh.id} {...events}>
          {editing?.id !== sh.id && (
            <text x={sh.x1} y={sh.y1} fill={stroke} className={styles.shapeText} dominantBaseline="middle">
              {sh.label}
            </text>
          )}
        </g>
      );
    }
    const b = box(sh);
    let outline;
    if (sh.type === 'rect') outline = <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} {...common} />;
    else if (sh.type === 'ellipse') outline = <ellipse cx={b.x + b.w / 2} cy={b.y + b.h / 2} rx={b.w / 2} ry={b.h / 2} {...common} />;
    else {
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      outline = <polygon points={`${cx},${b.y} ${b.x + b.w},${cy} ${cx},${b.y + b.h} ${b.x},${cy}`} {...common} />;
    }
    return (
      <g key={sh.id} {...events}>
        {outline}
        {label}
      </g>
    );
  }

  const editingShape = editing && saved.find((sh) => sh.id === editing.id);
  const editPos = editingShape && center(editingShape);

  return (
    <NodeViewWrapper className={styles.sketch} contentEditable={false}>
      {editable && (
        <div className={styles.sketchBar}>
          {TOOLS.map((tl) => (
            <button
              key={tl.id}
              type="button"
              className={`${styles.sketchBtn} ${tool === tl.id ? styles.sketchBtnActive : ''}`}
              onClick={() => { setTool(tl.id); setSelectedId(null); }}
              title={s[tl.id]}
              aria-label={s[tl.id]}
            >
              {tl.icon}
            </button>
          ))}
          <span className={styles.sketchSep} />
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.sketchColor} ${color === c ? styles.sketchColorActive : ''}`}
              style={{ color: c, background: c === INK ? 'var(--text-primary)' : c }}
              onClick={() => {
                setColor(c);
                if (selectedId) commit(saved.map((sh) => (sh.id === selectedId ? { ...sh, color: c } : sh)));
              }}
              title={s.color}
              aria-label={s.color}
            />
          ))}
          <label className={styles.sketchFill} title={s.fill}>
            <input type="checkbox" checked={fill} onChange={(e) => setFill(e.target.checked)} />
            {s.fill}
          </label>
          <span className={styles.sketchSep} />
          <button type="button" className={styles.sketchBtn} onClick={() => commit(saved.slice(0, -1))} disabled={!saved.length} title={s.undoShape} aria-label={s.undoShape}>↶</button>
          <button type="button" className={styles.sketchBtn} onClick={removeSelected} disabled={!selectedId} title={s.deleteShape} aria-label={s.deleteShape}>🗑</button>
          <button type="button" className={styles.sketchBtn} onClick={() => updateAttributes({ height: height + 120 })} title={s.taller} aria-label={s.taller}>↕+</button>
          <button type="button" className={styles.sketchBtn} onClick={() => updateAttributes({ height: Math.max(160, height - 120) })} title={s.shorter} aria-label={s.shorter}>↕−</button>
          <span className={styles.sketchSpacer} />
          <button type="button" className={styles.sketchBtn} onClick={deleteNode} title={s.removeBlock} aria-label={s.removeBlock}>✕</button>
        </div>
      )}
      <div className={styles.sketchBoard} tabIndex={editable ? 0 : undefined} onKeyDown={onKeyDown}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${height}`}
          className={`${styles.sketchSvg} ${editable && tool !== 'select' ? styles.sketchDrawing : ''}`}
          onPointerDown={onBoardDown}
          onPointerMove={onBoardMove}
          onPointerUp={onBoardUp}
          onPointerLeave={(e) => { if (drag) onBoardUp(e); }}
        >
          <defs>
            <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className={styles.sketchDot} />
            </pattern>
            {COLORS.map((c, i) => (
              <marker key={c} id={`${uid}-arrow-${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill={c} />
              </marker>
            ))}
          </defs>
          {editable && <rect width={WIDTH} height={height} fill={`url(#${uid}-grid)`} />}
          {shapes.map(renderShape)}
          {draft && renderShape(draft)}
        </svg>
        {editing && editPos && (
          <input
            autoFocus
            className={styles.sketchInput}
            style={{
              left: `${(editPos.x / WIDTH) * 100}%`,
              top: `${(editPos.y / height) * 100}%`,
              transform: editingShape.type === 'text' ? 'translate(0, -50%)' : 'translate(-50%, -50%)',
            }}
            value={editing.value}
            placeholder={s.typeLabel}
            onChange={(e) => setEditing((ed) => ({ ...ed, value: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finishEditing();
              if (e.key === 'Escape') finishEditing();
            }}
            onBlur={finishEditing}
          />
        )}
      </div>
      {editable && !saved.length && <p className={styles.sketchHint}>{s.diagramHint}</p>}
    </NodeViewWrapper>
  );
}
