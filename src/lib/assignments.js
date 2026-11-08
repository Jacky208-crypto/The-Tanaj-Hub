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

// "10 questions · Yona · perakim 1-2 · Multiple choice · One try"
export function assignmentSummary(a, t, language) {
  return [
    t('classes.nQuestions', { n: a.question_count || 10 }),
    a.book && bookLabel(a.book, language),
    a.chapters && t('classes.chaptersShort', { c: a.chapters }),
    a.mode === 'choice' && t('quizPlayer.modeChoice'),
    a.mode === 'free' && t('quizPlayer.modeFree'),
    a.allow_retries === false && t('classes.oneTry'),
  ].filter(Boolean).join(' · ');
}
