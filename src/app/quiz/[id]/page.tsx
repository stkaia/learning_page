import { notFound } from 'next/navigation';
import quizzesData from '@/data/quizzes.json';
import QuizEngine from '@/components/QuizEngine';

// Define the shape of our JSON data
type QuizData = {
  [key: string]: {
    title: string;
    questions: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
  };
};

export function generateStaticParams() {
  return Object.keys(quizzesData).map((id) => ({
    id,
  }));
}

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const quizSet = (quizzesData as QuizData)[id];

  if (!quizSet) {
    notFound();
  }

  return <QuizEngine title={quizSet.title} questions={quizSet.questions} />;
}
