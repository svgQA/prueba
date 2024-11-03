import { signal } from '@preact/signals';
import shortUUID from 'short-uuid';

interface IQuestion {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

export const questions = signal<IQuestion[]>([]);

export const addQuestion = () => {
  questions.value = [
    ...questions.value,
    {
      id: shortUUID.generate(),
      label: 'New Question',
      type: 'text',
      required: false,
    },
  ];
};

export const moveQuestion = (dragIndex: number, hoverIndex: number) => {
  const updatedQuestions = [...questions.value];
  const [movedQuestion] = updatedQuestions.splice(dragIndex, 1);
  updatedQuestions.splice(hoverIndex, 0, movedQuestion);
  questions.value = updatedQuestions;
};

export function removeQuestion(id: string) {
  questions.value = questions.value.filter((question) => question.id !== id);
}
