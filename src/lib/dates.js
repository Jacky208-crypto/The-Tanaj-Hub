const LOCALE = { english: 'en', spanish: 'es', hebrew: 'he' };

// "7 Nov 2026" in the site's language, for assignment due dates.
export function formatDue(iso, language) {
  return new Date(iso).toLocaleDateString(LOCALE[language], { day: 'numeric', month: 'short', year: 'numeric' });
}
