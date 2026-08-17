import { Analytics } from "@vercel/analytics/react"
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Torah from './pages/Torah';
import Neviim from './pages/Neviim';
import Ketuvim from './pages/Ketuvim';
import BookPage from './pages/BookPage';
import Quiz from './pages/Quiz';
import Summaries from './pages/Summaries';
import Notes from './pages/Notes';
import Search from './pages/Search';
import Login from './pages/Login';

// Lazy-loaded so Leaflet + the places dataset only download when the map is opened.
const MapPage = lazy(() => import('./pages/MapPage'));


export default function App() {
  return (
    <>
      <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </LanguageProvider>

      <Analytics />
    </>
  );
}
