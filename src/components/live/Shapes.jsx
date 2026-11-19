// The four answer shapes (plus two spares): shape + colour, so answers can be
// told apart without relying on colour alone.
const PATHS = [
  <polygon key="t" points="12,3 22,21 2,21" />,
  <polygon key="d" points="12,1.5 22.5,12 12,22.5 1.5,12" />,
  <circle key="c" cx="12" cy="12" r="10" />,
  <rect key="s" x="3" y="3" width="18" height="18" rx="2" />,
  <polygon key="st" points="12,1.5 15,8.6 22.5,9.3 16.8,14.3 18.6,21.8 12,17.8 5.4,21.8 7.2,14.3 1.5,9.3 9,8.6" />,
  <polygon key="h" points="7,2.5 17,2.5 22,12 17,21.5 7,21.5 2,12" />,
];

export default function Shape({ index, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      {PATHS[index % PATHS.length]}
    </svg>
  );
}
