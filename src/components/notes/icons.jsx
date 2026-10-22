// Small line icons (same style as the edit/delete icons on personal notes):
// 24×24, no fill, 2px round strokes in the current text color. They size
// with the surrounding font (1.15em) unless `size` is given.
function Icon({ size, children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size || '1.15em'}
      height={size || '1.15em'}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, verticalAlign: '-0.2em' }}
      {...props}
    >
      {children}
    </svg>
  );
}

export const EditIcon = (p) => (
  <Icon {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Icon>
);

export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </Icon>
);

export const UndoIcon = (p) => (
  <Icon {...p}><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></Icon>
);

export const RedoIcon = (p) => (
  <Icon {...p}><path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" /></Icon>
);

export const BulletListIcon = (p) => (
  <Icon {...p}>
    <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
    <circle cx="4.5" cy="6" r="0.6" /><circle cx="4.5" cy="12" r="0.6" /><circle cx="4.5" cy="18" r="0.6" />
  </Icon>
);

export const OrderedListIcon = (p) => (
  <Icon {...p}>
    <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
    <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </Icon>
);

export const ChecklistIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="6" height="6" rx="1" /><path d="m4.5 15.5 1.5 1.5 3-3" />
    <line x1="13" y1="7" x2="21" y2="7" /><line x1="13" y1="16" x2="21" y2="16" />
  </Icon>
);

export const QuoteIcon = (p) => (
  <Icon {...p}>
    <path d="M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5c0 2.5-1.5 4-4 5" />
    <path d="M19 11h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5c0 2.5-1.5 4-4 5" />
  </Icon>
);

export const PlusIcon = (p) => (
  <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
);

export const ChevronDownIcon = (p) => (
  <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>
);

// Open book — a quoted pasuk / a note on a pasuk.
export const BookIcon = (p) => (
  <Icon {...p}>
    <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z" />
    <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z" />
  </Icon>
);

export const QuestionIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

export const LightbulbIcon = (p) => (
  <Icon {...p}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" /><path d="M10 22h4" />
  </Icon>
);

export const AlertIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);

export const TableIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="12" y1="3" x2="12" y2="21" />
  </Icon>
);

// Two linked boxes — a diagram.
export const DiagramIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    <path d="M10 6.5h4a3 3 0 0 1 3 3V14" />
  </Icon>
);

export const DividerIcon = (p) => (
  <Icon {...p}><line x1="3" y1="12" x2="21" y2="12" /><path d="M8 6h8" opacity="0.4" /><path d="M8 18h8" opacity="0.4" /></Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>
);

export const ContinueIcon = (p) => (
  <Icon {...p}><path d="m15 10 5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" /></Icon>
);

export const ArrowRightIcon = (p) => (
  <Icon {...p}><line x1="5" y1="12" x2="19" y2="12" /><path d="m12 5 7 7-7 7" /></Icon>
);

export const HighlighterIcon = (p) => (
  <Icon {...p}>
    <path d="m9 11-6 6v3h9l3-3" />
    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
  </Icon>
);

// ---- Diagram tools ----
export const PointerIcon = (p) => (
  <Icon {...p}><path d="m4 4 7 17 2.5-7.5L21 11Z" /></Icon>
);

export const SquareIcon = (p) => (
  <Icon {...p}><rect x="3" y="6" width="18" height="12" rx="2" /></Icon>
);

export const CircleIcon = (p) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /></Icon>
);

export const DiamondIcon = (p) => (
  <Icon {...p}><path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" /></Icon>
);

export const LineIcon = (p) => (
  <Icon {...p}><line x1="5" y1="19" x2="19" y2="5" /></Icon>
);

export const PenIcon = (p) => (
  <Icon {...p}><path d="M3 17c3-1 4-6 7-6s2 5 5 5 4-4 6-5" /></Icon>
);

export const TextIcon = (p) => (
  <Icon {...p}><path d="M4 7V5h16v2" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="9" y1="19" x2="15" y2="19" /></Icon>
);

export const TallerIcon = (p) => (
  <Icon {...p}><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></Icon>
);

export const ShorterIcon = (p) => (
  <Icon {...p}><path d="m7 20 5-5 5 5" /><path d="m7 4 5 5 5-5" /></Icon>
);
