import { useLanguage } from '../context/LanguageContext';

// Placeholder while content from Supabase loads, or an error with a retry button.
export default function ContentStatus({ error, onRetry }) {
  const { t } = useLanguage();
  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
      {error ? (
        <>
          <p style={{ marginBottom: '0.75rem' }}>{t('content.error')}</p>
          {onRetry && (
            <button className="nav-btn" onClick={onRetry}>{t('content.retry')}</button>
          )}
        </>
      ) : (
        <p>{t('content.loading')}</p>
      )}
    </div>
  );
}
