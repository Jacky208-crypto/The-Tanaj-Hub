import { Link } from 'react-router-dom';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { noteStrings } from './noteStrings';
import { PASSUK_COLORS, readerLink } from './noteUtils';
import styles from './RichNote.module.css';

const CALLOUT_ICONS = { question: '?', insight: '💡', important: '!' };

export function PassukQuoteView({ node, editor, updateAttributes, deleteNode, extension }) {
  const s = extension.options.strings || noteStrings('english');
  const { bookId, chapter, verse, label, text, lang, color } = node.attrs;
  const editable = editor.isEditable;
  return (
    <NodeViewWrapper as="blockquote" data-passuk="" className={`${styles.passukQuote} ${styles[`hl_${color}`] || ''}`} data-drag-handle>
      <p className={styles.passukText} dir={lang === 'hebrew' ? 'rtl' : 'ltr'} lang={lang === 'hebrew' ? 'he' : undefined}>
        {text}
      </p>
      <div className={styles.passukFooter} contentEditable={false}>
        {bookId && chapter ? (
          <Link className={styles.passukRef} to={readerLink(bookId, chapter, verse, lang)} dir="ltr">
            {label}
          </Link>
        ) : (
          <span className={styles.passukRef} dir="ltr">{label}</span>
        )}
        {editable && (
          <span className={styles.blockTools}>
            {PASSUK_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.colorDot} ${styles[`hl_${c}`]} ${c === color ? styles.colorDotActive : ''}`}
                onClick={() => updateAttributes({ color: c })}
                aria-label={`${s.highlight}: ${c}`}
                title={s.highlight}
              />
            ))}
            <button type="button" className={styles.blockRemove} onClick={deleteNode} title={s.removeBlock} aria-label={s.removeBlock}>
              ✕
            </button>
          </span>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export function CalloutView({ node, editor, updateAttributes, deleteNode, extension }) {
  const s = extension.options.strings || noteStrings('english');
  const { kind, ref, answered } = node.attrs;
  const editable = editor.isEditable;
  return (
    <NodeViewWrapper className={`${styles.callout} ${styles[`callout_${kind}`] || ''} ${answered ? styles.calloutAnswered : ''}`}>
      <div className={styles.calloutHead} contentEditable={false}>
        <span className={styles.calloutIcon}>{CALLOUT_ICONS[kind] || '•'}</span>
        <span className={styles.calloutLabel}>{s[kind] || kind}</span>
        {ref && <span className={styles.calloutRef} dir="ltr">{ref}</span>}
        <span className={styles.blockTools}>
          {kind === 'question' && (
            <label className={styles.answeredToggle}>
              <input
                type="checkbox"
                checked={!!answered}
                disabled={!editable}
                onChange={(e) => updateAttributes({ answered: e.target.checked })}
              />
              {s.answered}
            </label>
          )}
          {editable && (
            <button type="button" className={styles.blockRemove} onClick={deleteNode} title={s.removeBlock} aria-label={s.removeBlock}>
              ✕
            </button>
          )}
        </span>
      </div>
      <NodeViewContent className={styles.calloutBody} />
    </NodeViewWrapper>
  );
}
