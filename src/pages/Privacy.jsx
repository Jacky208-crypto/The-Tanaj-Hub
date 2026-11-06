import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Privacy.module.css';

const CONTACT_EMAIL = 'jackyfnounou@gmail.com';

// Privacy + short terms. The text lives under `privacy` in translations.js;
// update it (and `updated`) whenever the site starts collecting something new
// or adds a new outside service.
export default function Privacy() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const sections = t('privacy.sections');

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('privacy.title')}</h1>
        <p className={styles.updated}>{t('privacy.updated')}</p>
        <p className={styles.intro}>{t('privacy.intro')}</p>

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

          <section className={styles.section}>
            <h2 className={styles.heading}>{t('privacy.contactHeading')}</h2>
            <p className={styles.body}>
              {t('privacy.contactBody')}{' '}
              <a className={styles.link} href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
