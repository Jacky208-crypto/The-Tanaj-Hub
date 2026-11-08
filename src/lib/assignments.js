import { QUIZ_BOOKS, QUIZ_CHAPTERS, bookLabel, getBookById, parseChapters } from '../data/books';

// The QuizPlayer `quiz` object for a teacher's assignment.
export function assignmentQuiz(a, label) {
  const quiz = {
    label,
    quizKeys: [a.quiz_key],
    count: a.question_count || 10,
    assignmentId: a.id,
    mode: a.mode || undefined,
    noRetry: a.allow_retries === false,
  };
  try {
    if (QUIZ_BOOKS[a.quiz_key] && a.book) {
      quiz.books = {
        [a.quiz_key]: { [a.book]: a.chapters ? parseChapters(a.chapters, getBookById(a.book).chapters) : [] },
      };
    } else if (QUIZ_CHAPTERS[a.quiz_key] && a.chapters) {
      quiz.chapters = { [a.quiz_key]: parseChapters(a.chapters, QUIZ_CHAPTERS[a.quiz_key]) };
    }
  } catch {
    // Chapters are checked when the teacher saves; if not, ask the whole quiz.
  }
  return quiz;
}

// The headline for an assignment of any kind.
//   quiz → "Bereshit"   reading → "Read Bereshit 12-15"   discussion → the question
export function assignmentTitle(a, quizzes, t, language) {
  if (a.kind === 'reading') {
    return t('classes.readingTitle', { ref: [bookLabel(a.book, language), a.chapters].filter(Boolean).join(' ') });
  }
  if (a.kind === 'discussion') return a.prompt;
  const quiz = quizzes.find((q) => q.key === a.quiz_key);
  return quiz ? (quiz[`label_${{ english: 'en', spanish: 'es', hebrew: 'he' }[language]}`] || quiz.label_en) : a.quiz_key;
}

// The first perek a reading/discussion points at (for "Open the text").
export function firstChapter(a) {
  const book = a.book && getBookById(a.book);
  if (!book) return null;
  try {
    return (a.chapters && parseChapters(a.chapters, book.chapters)[0]) || 1;
  } catch {
    return 1;
  }
}

// "10 questions · Yona · perakim 1-2 · Multiple choice · One try"
export function assignmentSummary(a, t, language) {
  if (a.kind === 'reading') return t('classes.kindReading');
  if (a.kind === 'discussion') {
    const ref = [a.book && bookLabel(a.book, language), a.chapters].filter(Boolean).join(' ');
    return [t('classes.kindDiscussion'), ref].filter(Boolean).join(' · ');
  }
  return [
    t('classes.nQuestions', { n: a.question_count || 10 }),
    a.book && bookLabel(a.book, language),
    a.chapters && t('classes.chaptersShort', { c: a.chapters }),
    a.mode === 'choice' && t('quizPlayer.modeChoice'),
    a.mode === 'free' && t('quizPlayer.modeFree'),
    a.allow_retries === false && t('classes.oneTry'),
  ].filter(Boolean).join(' · ');
}
