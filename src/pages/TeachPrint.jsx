import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getClassResults } from '../lib/supabaseClient';
import { translator } from '../lib/translate';
import { usePageTitle } from '../lib/pageTitle';
import styles from './Classes.module.css';

// A page the teacher prints (or puts on the board): the class code, the
// address, and three steps for students.
export default function TeachPrint() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const { language, t } = useLanguage();
  const [cls, setCls] = useState(null);
  const [error, setError] = useState(false);
  usePageTitle(cls ? t('a11y.joinSheet', { name: cls.name }) : null);

  useEffect(() => {
    if (!isTeacher) return;
    getClassResults(classId)
      .then((d) => setCls(d?.cls ?? null))
      .catch(() => setError(true));
  }, [classId, isTeacher]);

  const joinUrl = `${window.location.host}/join`;
  // The sheet is for students: in the class's language when one is set.
  const sheetLanguage = cls?.language || language;
  const ts = translator(sheetLanguage);
  const steps = ts('classes.printSteps', { url: joinUrl });

  return (
    <div className={`${styles.page} ${styles.printPage}`} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <div className={styles.noPrint}>
          <button className={styles.back} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
          {cls && <button className={styles.primary} onClick={() => window.print()}>{t('classes.print')}</button>}
        </div>
        {error && <div className={styles.error}>{t('classes.errGeneric')}</div>}
        {cls && (
          <div className={styles.printSheet} dir={sheetLanguage === 'hebrew' ? 'rtl' : 'ltr'}>
            <p className={styles.printClass}>{cls.name}</p>
            <h1 className={styles.printTitle}>{ts('classes.joinTitle')}</h1>
            <ol className={styles.printSteps}>
              {steps.map((s) => <li key={s}><span dir="auto">{s}</span></li>)}
            </ol>
            <div className={styles.printCode} dir="ltr">{cls.join_code}</div>
            <p className={styles.printUrl} dir="ltr">{joinUrl}</p>
            <p className={styles.printNote}>{ts('classes.printNote')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
