import { Analytics } from "@vercel/analytics/react"
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { PageTitle, SkipLink } from './components/A11y';
import ErrorBoundary from './components/ErrorBoundary';
import { startErrorReporting } from './lib/errorReport';
import { whenIdle } from './lib/cache';

startErrorReporting();

// Every page is its own download, so the first visit only loads the page it opens.
// (Home stays in the main file: it's what most visitors land on.)
import Home from './pages/Home';
const Torah = lazy(() => import('./pages/Torah'));
const Neviim = lazy(() => import('./pages/Neviim'));
const Ketuvim = lazy(() => import('./pages/Ketuvim'));
const BookPage = lazy(() => import('./pages/BookPage'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Summaries = lazy(() => import('./pages/Summaries'));
const Notes = lazy(() => import('./pages/Notes'));
const Search = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/Login'));
const Suggest = lazy(() => import('./pages/Suggest'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Schools = lazy(() => import('./pages/Schools'));
const Join = lazy(() => import('./pages/Join'));
const MyClasses = lazy(() => import('./pages/MyClasses'));
const Teach = lazy(() => import('./pages/Teach'));
const TeachResults = lazy(() => import('./pages/TeachResults'));
const TeachPrint = lazy(() => import('./pages/TeachPrint'));
const TeachWorksheet = lazy(() => import('./pages/TeachWorksheet'));
const TeachLive = lazy(() => import('./pages/TeachLive'));
const LivePlay = lazy(() => import('./pages/LivePlay'));
const Account = lazy(() => import('./pages/Account'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Lazy-loaded so Leaflet + the places dataset only download when the map is opened.
const MapPage = lazy(() => import('./pages/MapPage'));
// Admin-only content editor; lazy so visitors never download it.
const Admin = lazy(() => import('./pages/Admin'));


// Once the first page is up, quietly download the pages people go to next so
// clicking through feels instant.
whenIdle(() => {
  import('./pages/BookPage');
  import('./pages/Torah');
  import('./pages/Quiz');
});

export default function App() {
  return (
    <>
      <ThemeProvider>
      <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <SkipLink />
          <PageTitle />
          <main id="main-content" tabIndex={-1}>
          <ErrorBoundary>
          <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/torah" element={<Torah />} />
            <Route path="/neviim" element={<Neviim />} />
            <Route path="/ketuvim" element={<Ketuvim />} />
            <Route path="/book/:bookId" element={<BookPage />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/summaries" element={<Summaries />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/map"
              element={
                <Suspense fallback={<div style={{ padding: 24 }}>Loading map…</div>}>
                  <MapPage />
                </Suspense>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/suggest" element={<Suggest />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/join" element={<Join />} />
            <Route path="/my-classes" element={<MyClasses />} />
            <Route path="/teach" element={<Teach />} />
            <Route path="/teach/:classId" element={<TeachResults />} />
            <Route path="/teach/:classId/print" element={<TeachPrint />} />
            <Route path="/teach/:classId/worksheet/:assignmentId" element={<TeachWorksheet />} />
            <Route path="/teach/:classId/live" element={<TeachLive />} />
            <Route path="/live/:gameId" element={<LivePlay />} />
            <Route path="/account" element={<Account />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
                  <Admin />
                </Suspense>
              }
            />
          </Routes>
          </Suspense>
          </ErrorBoundary>
          </main>
        </BrowserRouter>
      </AuthProvider>
      </LanguageProvider>
      </ThemeProvider>

      <Analytics />
    </>
  );
}
