import { Component } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { reportError } from '../lib/errorReport';

function Fallback() {
  const { t } = useLanguage();
  return (
    <div role="alert" style={{ maxWidth: 480, margin: '15vh auto', padding: '0 20px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Arial', fontSize: 26, marginBottom: 8 }}>{t('errors.title')}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 18 }}>{t('errors.body')}</p>
      <button className="nav-btn" onClick={() => window.location.reload()}>{t('errors.reload')}</button>
      <button className="nav-btn" onClick={() => { window.location.href = '/'; }}>{t('errors.home')}</button>
    </div>
  );
}

class Boundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    reportError(error, 'Screen crashed');
  }

  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}

// Catches a crash in any page and shows a friendly screen instead of a blank
// one. Resets when the person moves to another page.
export default function ErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <Boundary key={pathname}>{children}</Boundary>;
}
