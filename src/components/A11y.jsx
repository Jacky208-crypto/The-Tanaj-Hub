import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { headingTitle, titleOverride } from '../lib/pageTitle';

// First thing a keyboard user reaches: jumps past the top bar (language,
// theme, log in…) to the page's main heading, so the next Tab is in the content.
export function SkipLink() {
  const { t } = useLanguage();
  const skip = (e) => {
    const target = document.querySelector('main h1') || document.getElementById('main-content');
    if (!target) return;
    e.preventDefault();
    target.setAttribute('tabindex', '-1');
    target.setAttribute('data-skip-target', '');
    target.focus();
  };
  return <a className="skip-link" href="#main-content" onClick={skip}>{t('a11y.skip')}</a>;
}

// Names each page in the browser tab (and for screen readers, which read the
// title when a page changes) after its main heading: "Torah · The Tanaj Hub",
// unless the page set something more specific with usePageTitle().
// Pages load their content at different speeds, so it checks a few times.
export function PageTitle() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    const update = () => {
      if (!titleOverride()) document.title = headingTitle(pathname);
    };
    const timers = [50, 500, 1500, 3000].map((ms) => setTimeout(update, ms));
    return () => timers.forEach(clearTimeout);
  }, [pathname, language]);
  return null;
}
