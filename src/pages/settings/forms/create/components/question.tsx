import { useDrag, useDrop } from 'react-dnd';
import { questions, moveQuestion } from '../store';
import './index.css';

const ItemType = {
  QUESTION: 'question',
};

interface IQuestionProps {
  question: any;
  index: number;
  selected?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const Question = ({
  question,
  index,
  selected,
  onSelect,
  onDelete,
}: IQuestionProps) => {
  const [, ref] = useDrag({
    type: ItemType.QUESTION,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.QUESTION,
    hover: (item: any) => {
      if (item.index !== index) {
        moveQuestion(item.index, index);
        item.index = index;
      }
    },
  });

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation();
    onSelect(question.id);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(question.id);
  };

  return (
    <>
      <tr
        ref={(node) => ref(drop(node))}
        className='vx-form-question'
        onClick={handleSelect}
      >
        <td
          class='w-9/12'
          className={`${selected ? 'border-2 border-teal-500' : ''}`}
        >
          <input type='text' className='w-full' value={question.label} />
        </td>
        <td className='w-3/12'>
          <select value={question.type} className='bg-transparent'>
            <option value='text'>Text answer</option>
            <option value='date'>Inspection date</option>
            <option value='person'>Person</option>
            <option value='location'>Inspection location</option>
          </select>
        </td>
      </tr>
      {selected && (
        <tr className='vx-form-question'>
          <td
            colspan={2}
            className='flex flex-row items-center gap-2 bg-blue-100 relative'
          >
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={question.required}
                onChange={(e: any) => {
                  question.required = e.target.checked;
                  questions.value = [...questions.value];
                }}
                className='h-4 w-4 text-blue-600'
              />
              <span className='ml-2'>Required</span>
            </div>
          </td>
          <td>
            <span
              className='cursor-pointer font-bold vx-icon vx-delete'
              onClick={handleDelete}
            >
              delete
            </span>
          </td>
        </tr>
      )}
    </>
  );
};
