import { useEffect } from 'react';

export const SITE = 'The Tanaj Hub';

// The tab name a page asked for (more specific than its heading), if any.
let override = null;
export const titleOverride = () => override;

export function formatTitle(text) {
  return text && text !== SITE ? `${text} · ${SITE}` : SITE;
}

// The page's main heading: the default tab name.
export function headingTitle(pathname = window.location.pathname) {
  const heading = document.querySelector('main h1')?.textContent.trim();
  return pathname === '/' ? SITE : formatTitle(heading);
}

// Gives the tab a specific name while the component shows something worth
// naming: "Shmuel Alef 12:2 with commentary", "Bereshit quiz · Question 3 of 10".
// Pass null to fall back to the page's heading.
export function usePageTitle(text) {
  useEffect(() => {
    if (!text) return undefined;
    override = text;
    document.title = formatTitle(text);
    return () => {
      if (override !== text) return;
      override = null;
      // Let the next screen render, then go back to its heading.
      setTimeout(() => { if (!override) document.title = headingTitle(); }, 60);
    };
  }, [text]);
}
