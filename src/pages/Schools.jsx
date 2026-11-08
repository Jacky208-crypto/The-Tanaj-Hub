import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Schools.module.css';

// Where school inquiries go. Same address as the privacy page; change both
// together (src/pages/Privacy.jsx) when there is a dedicated one.
const SCHOOLS_EMAIL = 'jackyfnounou@gmail.com';

// "For schools" page. The text lives under `schools` in translations.js.
// A mailto link keeps it simple: no form to host, no spam to filter.
export default function Schools() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const sections = t('schools.sections');
  const mailto = `mailto:${SCHOOLS_EMAIL}?subject=${encodeURIComponent(t('schools.mailSubject'))}`;

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('schools.title')}</h1>
        <p className={styles.intro}>{t('schools.intro')}</p>

        <div className={styles.card}>
          {sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.body && <p className={styles.body}>{section.body}</p>}
              {section.items && (
                <ul className={styles.list}>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
          <p className={styles.body}>
            <Link className={styles.link} to="/privacy">{t('home.privacyLink')}</Link>
          </p>
        </div>

        <div className={`${styles.card} ${styles.cta}`}>
          <h2 className={styles.heading}>{t('schools.ctaHeading')}</h2>
          <p className={styles.body}>{t('schools.ctaBody')}</p>
          <a className={styles.button} href={mailto}>{t('schools.ctaButton')}</a>
          <p className={styles.small} dir="ltr">{SCHOOLS_EMAIL}</p>
        </div>
      </div>
    </div>
  );
}
