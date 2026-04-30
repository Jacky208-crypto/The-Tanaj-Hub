import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Torah from './pages/Torah';
import Neviim from './pages/Neviim';
import Ketuvim from './pages/Ketuvim';
import BookPage from './pages/BookPage';
import Quiz from './pages/Quiz';
import Summaries from './pages/Summaries';
import Notes from './pages/Notes';  

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/torah" element={<Torah />} />
        <Route path="/neviim" element={<Neviim />} />
        <Route path="/ketuvim" element={<Ketuvim />} />
        <Route path="/book/:bookId" element={<BookPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/summaries" element={<Summaries />} />
        <Route path="/notes" element={<Notes />} />  {/* ADD THIS */}
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}