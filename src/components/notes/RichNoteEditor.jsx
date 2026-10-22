import { useEffect, useRef, useState } from 'react';
import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import { TaskList, TaskItem } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { Placeholder } from '@tiptap/extensions';
import { PassukQuote, Callout, Sketch } from './noteExtensions';
import PassukPicker from './PassukPicker';
import { noteStrings } from './noteStrings';
import { noteToHtml } from './noteUtils';
import styles from './RichNote.module.css';

const HIGHLIGHTS = ['#fde68a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#e9d5ff'];
const TEXT_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#ea580c', '#9333ea', '#6b7280'];

function noteExtensions(s, placeholder) {
  return [
    StarterKit,
    Highlight.configure({ multicolor: true }),
    TextStyle,
    Color,
    TaskList,
    TaskItem.configure({ nested: true }),
    TableKit.configure({ table: { resizable: false } }),
    Placeholder.configure({ placeholder: placeholder || '' }),
    PassukQuote.configure({ strings: s }),
    Callout.configure({ strings: s }),
    Sketch.configure({ strings: s }),
  ];
}

// Small dropdown used by the toolbar. Closes when clicking anywhere else.
function Menu({ label, title, active, children, wide }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <span className={styles.menuWrap} ref={ref}>
      <button
        type="button"
        className={`${styles.tbBtn} ${active ? styles.tbActive : ''} ${wide ? styles.tbWide : ''}`}
        onClick={() => setOpen((o) => !o)}
        title={title}
        aria-label={title}
        aria-expanded={open}
      >
        {label} <span className={styles.caret}>▾</span>
      </button>
      {open && (
        <div
          className={styles.menu}
          onClick={() => setOpen(false)}
          // Flip to open leftwards when it would run off the screen.
          ref={(el) => {
            if (el && el.getBoundingClientRect().right > window.innerWidth - 8) el.classList.add(styles.menuEnd);
          }}
        >
          {children}
        </div>
      )}
    </span>
  );
}

function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      className={`${styles.tbBtn} ${active ? styles.tbActive : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, s, onPickPassuk }) {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      highlight: e.isActive('highlight'),
      color: e.getAttributes('textStyle').color,
      level: [1, 2, 3].find((l) => e.isActive('heading', { level: l })) || 0,
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      task: e.isActive('taskList'),
      quote: e.isActive('blockquote'),
      table: e.isActive('table'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();
  const styleLabels = [s.normal, s.heading1, s.heading2, s.heading3];

  return (
    // preventDefault keeps the editor's selection while clicking buttons.
    <div className={styles.toolbar} onMouseDown={(e) => { if (e.target.tagName !== 'INPUT') e.preventDefault(); }}>
      <Btn onClick={() => chain().undo().run()} disabled={!st.canUndo} title={s.undo}>↶</Btn>
      <Btn onClick={() => chain().redo().run()} disabled={!st.canRedo} title={s.redo}>↷</Btn>
      <span className={styles.tbSep} />

      <Menu label={styleLabels[st.level]} title={s.textStyle} wide>
        <button type="button" className={styles.menuItem} onClick={() => chain().setParagraph().run()}>{s.normal}</button>
        <button type="button" className={`${styles.menuItem} ${styles.menuH1}`} onClick={() => chain().setHeading({ level: 1 }).run()}>{s.heading1}</button>
        <button type="button" className={`${styles.menuItem} ${styles.menuH2}`} onClick={() => chain().setHeading({ level: 2 }).run()}>{s.heading2}</button>
        <button type="button" className={`${styles.menuItem} ${styles.menuH3}`} onClick={() => chain().setHeading({ level: 3 }).run()}>{s.heading3}</button>
      </Menu>
      <span className={styles.tbSep} />

      <Btn onClick={() => chain().toggleBold().run()} active={st.bold} title={s.bold}><b>B</b></Btn>
      <Btn onClick={() => chain().toggleItalic().run()} active={st.italic} title={s.italic}><i>I</i></Btn>
      <Btn onClick={() => chain().toggleUnderline().run()} active={st.underline} title={s.underline}><u>U</u></Btn>
      <Btn onClick={() => chain().toggleStrike().run()} active={st.strike} title={s.strike}><s>S</s></Btn>
      <Menu label={<span className={styles.hlIcon}>A</span>} title={s.highlight} active={st.highlight}>
        <div className={styles.swatches}>
          {HIGHLIGHTS.map((c) => (
            <button key={c} type="button" className={styles.swatch} style={{ background: c }} onClick={() => chain().setHighlight({ color: c }).run()} aria-label={s.highlight} />
          ))}
          <button type="button" className={`${styles.swatch} ${styles.swatchNone}`} onClick={() => chain().unsetHighlight().run()} title={s.clearColor} aria-label={s.clearColor} />
        </div>
      </Menu>
      <Menu label={<span style={{ color: st.color || undefined }} className={styles.colorIcon}>A</span>} title={s.textColor}>
        <div className={styles.swatches}>
          {TEXT_COLORS.map((c) => (
            <button key={c} type="button" className={styles.swatch} style={{ background: c }} onClick={() => chain().setColor(c).run()} aria-label={s.textColor} />
          ))}
          <button type="button" className={`${styles.swatch} ${styles.swatchNone}`} onClick={() => chain().unsetColor().run()} title={s.clearColor} aria-label={s.clearColor} />
        </div>
      </Menu>
      <span className={styles.tbSep} />

      <Btn onClick={() => chain().toggleBulletList().run()} active={st.bullet} title={s.bulletList}>•≡</Btn>
      <Btn onClick={() => chain().toggleOrderedList().run()} active={st.ordered} title={s.orderedList}>1≡</Btn>
      <Btn onClick={() => chain().toggleTaskList().run()} active={st.task} title={s.checklist}>☑</Btn>
      <Btn onClick={() => chain().toggleBlockquote().run()} active={st.quote} title={s.quote}>❝</Btn>
      <span className={styles.tbSep} />

      <Menu label={`＋ ${s.insert}`} title={s.insert} wide>
        <button type="button" className={styles.menuItem} onClick={onPickPassuk}>📜 {s.insertPassuk}</button>
        <button type="button" className={styles.menuItem} onClick={() => chain().insertCallout({ kind: 'question' }).run()}>❓ {s.insertQuestion}</button>
        <button type="button" className={styles.menuItem} onClick={() => chain().insertCallout({ kind: 'insight' }).run()}>💡 {s.insertInsight}</button>
        <button type="button" className={styles.menuItem} onClick={() => chain().insertCallout({ kind: 'important' }).run()}>❗ {s.insertImportant}</button>
        <button type="button" className={styles.menuItem} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>▦ {s.table}</button>
        <button type="button" className={styles.menuItem} onClick={() => chain().insertSketch().run()}>◇ {s.insertDiagram}</button>
        <button type="button" className={styles.menuItem} onClick={() => chain().setHorizontalRule().run()}>— {s.divider}</button>
      </Menu>

      {st.table && (
        <Menu label={`▦ ${s.table}`} title={s.table} active wide>
          <button type="button" className={styles.menuItem} onClick={() => chain().addRowAfter().run()}>{s.addRowAfter}</button>
          <button type="button" className={styles.menuItem} onClick={() => chain().addColumnAfter().run()}>{s.addColAfter}</button>
          <button type="button" className={styles.menuItem} onClick={() => chain().deleteRow().run()}>{s.deleteRow}</button>
          <button type="button" className={styles.menuItem} onClick={() => chain().deleteColumn().run()}>{s.deleteCol}</button>
          <button type="button" className={styles.menuItem} onClick={() => chain().toggleHeaderRow().run()}>{s.toggleHeader}</button>
          <button type="button" className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => chain().deleteTable().run()}>{s.deleteTable}</button>
        </Menu>
      )}
    </div>
  );
}

// Rich note editor: headings, lists, checklists, tables, highlights, quoted
// pesukim, question/insight boxes and diagrams. Saves as HTML via onChange.
// Re-mount (key) it to load a different note. `editorRef` receives the
// TipTap editor so callers can insert blocks (e.g. the reader's "Quote pasuk").
export default function RichNoteEditor({
  content, onChange, language = 'english', placeholder, editorRef, onReady, compact = false, autofocus = false,
}) {
  const s = noteStrings(language);
  const [picking, setPicking] = useState(false);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const editor = useEditor({
    extensions: noteExtensions(s, placeholder),
    content: noteToHtml(content),
    textDirection: 'auto',
    autofocus: autofocus ? 'end' : false,
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor: e }) => onChangeRef.current?.(e.getHTML()),
  }, [language]);

  useEffect(() => {
    if (editorRef) editorRef.current = editor;
    onReady?.(editor);
    return () => {
      if (editorRef) editorRef.current = null;
      onReady?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editorRef]);

  if (!editor) return null;
  return (
    <div className={`${styles.editorShell} ${compact ? styles.compact : ''}`}>
      <Toolbar editor={editor} s={s} onPickPassuk={() => setPicking(true)} />
      <EditorContent editor={editor} className={`${styles.content} ${styles.editable}`} />
      {picking && (
        <PassukPicker
          s={s}
          language={language}
          onClose={() => setPicking(false)}
          onPick={(attrs) => {
            editor.chain().focus().insertPassukQuote(attrs).run();
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

// Read-only rendering of a saved note, with the same blocks and styles.
export function RichNoteView({ content, language = 'english' }) {
  const s = noteStrings(language);
  const editor = useEditor({
    extensions: noteExtensions(s),
    content: noteToHtml(content),
    editable: false,
    textDirection: 'auto',
    shouldRerenderOnTransaction: false,
  }, [language, content]);
  return <EditorContent editor={editor} className={styles.content} />;
}
