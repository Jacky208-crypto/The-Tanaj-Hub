import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PassukQuoteView, CalloutView } from './NoteBlockViews';
import SketchView from './SketchView';

// Where to insert: at the cursor, or — with { atEnd: true } — as a new block
// at the end of the note (reusing a trailing empty paragraph).
// `commands`/`tr` are the ones handed to the command, so it works inside chains.
function insertAt({ commands, tr }, content, atEnd) {
  if (!atEnd) return commands.insertContent(content);
  const { doc } = tr;
  const last = doc.lastChild;
  const end = doc.content.size;
  const range = last?.type.name === 'paragraph' && last.content.size === 0
    ? { from: end - last.nodeSize, to: end }
    : end;
  return commands.insertContentAt(range, content);
}

// Plain data-* attribute that round-trips through the stored HTML.
const dataAttr = (name, key, { number = false, fallback = null } = {}) => ({
  default: fallback,
  parseHTML: (el) => {
    const v = el.getAttribute(`data-${name}`);
    if (v == null || v === '') return fallback;
    return number ? Number(v) : v;
  },
  renderHTML: (attrs) => (attrs[key] == null ? {} : { [`data-${name}`]: attrs[key] }),
});

// A pasuk quoted into a note: the verse text plus its reference, linked back
// to the reader. Atom block — its text is the pasuk itself, not editable.
export const PassukQuote = Node.create({
  name: 'passukQuote',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return { strings: null };
  },

  addAttributes() {
    return {
      bookId: dataAttr('book', 'bookId'),
      chapter: dataAttr('chapter', 'chapter', { number: true }),
      verse: dataAttr('verse', 'verse', { number: true }),
      verseTo: dataAttr('verse-to', 'verseTo', { number: true }),
      label: dataAttr('label', 'label', { fallback: '' }),
      text: dataAttr('text', 'text', { fallback: '' }),
      lang: dataAttr('lang', 'lang', { fallback: 'hebrew' }),
      color: dataAttr('color', 'color', { fallback: 'yellow' }),
    };
  },

  parseHTML() {
    return [{ tag: 'blockquote[data-passuk]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'blockquote',
      mergeAttributes({ 'data-passuk': '' }, HTMLAttributes),
      ['p', { dir: node.attrs.lang === 'hebrew' ? 'rtl' : 'ltr' }, node.attrs.text],
      ['cite', {}, node.attrs.label],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PassukQuoteView);
  },

  addCommands() {
    return {
      insertPassukQuote: (attrs, { atEnd = false } = {}) => (props) =>
        insertAt(props, [{ type: this.name, attrs }, { type: 'paragraph' }], atEnd),
    };
  },
});

// Colored box with a label: a Question (with an "answered" tick), an Insight
// or something Important. Holds normal paragraphs/lists inside.
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  draggable: true,

  addOptions() {
    return { strings: null };
  },

  addAttributes() {
    return {
      kind: dataAttr('kind', 'kind', { fallback: 'question' }),
      ref: dataAttr('ref', 'ref', { fallback: '' }),
      answered: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-answered') === 'true',
        renderHTML: (attrs) => (attrs.kind === 'question' ? { 'data-answered': String(!!attrs.answered) } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-callout': '' }, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },

  addCommands() {
    return {
      insertCallout: (attrs, text = '', { atEnd = false } = {}) => (props) =>
        insertAt(props, {
          type: this.name,
          attrs,
          content: [{ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] }],
        }, atEnd),
    };
  },
});

// A small drawing board (boxes, circles, arrows, lines, pen, text) for
// diagrams. The shapes are kept as JSON in the node.
export const Sketch = Node.create({
  name: 'sketch',
  group: 'block',
  atom: true,
  selectable: true,

  addOptions() {
    return { strings: null };
  },

  addAttributes() {
    return {
      shapes: {
        default: [],
        parseHTML: (el) => {
          try { return JSON.parse(el.getAttribute('data-shapes') || '[]'); } catch { return []; }
        },
        renderHTML: (attrs) => ({ 'data-shapes': JSON.stringify(attrs.shapes || []) }),
      },
      height: dataAttr('height', 'height', { number: true, fallback: 320 }),
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-sketch]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-sketch': '' }, HTMLAttributes)];
  },

  addNodeView() {
    // The board handles its own mouse/keyboard; keep the editor out of it.
    return ReactNodeViewRenderer(SketchView, { stopEvent: () => true });
  },

  addCommands() {
    return {
      insertSketch: () => ({ commands }) =>
        commands.insertContent([{ type: this.name, attrs: { shapes: [] } }, { type: 'paragraph' }]),
    };
  },
});
