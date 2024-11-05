import { useDrag, useDrop } from 'react-dnd';
import { form, moveElement, IElement } from '../store';
import { TargetedEvent } from 'preact/compat';
import '../assets/index.css';

const ItemType = {
  QUESTION: 'question',
};

interface IElementProps {
  question: IElement;
  index: number;
  page: string;
  selected?: boolean;
  onSelect: (id: string, page: string) => void;
  onDelete: (id: string, page: string) => void;
}

export const FormElement = ({
  question,
  index,
  page,
  selected,
  onSelect,
  onDelete,
}: IElementProps) => {
  const [, ref] = useDrag({
    type: ItemType.QUESTION,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.QUESTION,
    hover: (item: any) => {
      if (item.index !== index) {
        moveElement(item.index, index, page);
        item.index = index;
      }
    },
  });

  const handleInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    form.value = form.value.map((p) => {
      if (p.id === page) {
        return {
          ...p,
          elements: p.elements.map((element: IElement) =>
            element.id === question.id
              ? { ...element, label: (e.target as HTMLInputElement).value }
              : element
          ),
        };
      }
      return p;
    });
  };

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation();
    onSelect(question.id, page);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(question.id, page);
  };

  return (
    <>
      <tr ref={drop} className='vx-form-question' onClick={handleSelect}>
        <td
          class='w-9/12'
          className={`flex flex-row ${selected ? 'border-2 border-teal-500' : ''}`}
        >
          <span
            ref={(node) => ref(drop(node))}
            className='cursor-move vx-icon vx-apps size-sm mx-2'
          ></span>
          <input
            type='text'
            className='w-full'
            value={question.label}
            onChange={handleInputChange}
          />
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
      <tr className='vx-form-question'>
        <div
          className={`px-2 flex items-center justify-between flex-row ${selected ? 'visible py-2' : 'invisible h-0'}`}
        >
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={question.required}
              className='h-4 w-4'
            />
            <span className='ml-2'>Required</span>
          </div>
          <div
            class='bg-red-400 absolute cursor-pointer text-white w-8 h-8 rounded-md text-center -right-9'
            onClick={handleDelete}
          >
            <span className='vx-icon vx-logo size-sm' />
            <h6 className='text-2xs'>Delete</h6>
          </div>
        </div>
      </tr>
    </>
  );
};
