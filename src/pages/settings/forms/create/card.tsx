import { IFormElement } from '@/types';
import type { Identifier, XYCoord } from 'dnd-core';
import { useRef } from 'preact/hooks';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  CARD: 'card',
};

export interface CardElementProps {
  id: string;
  index: number;
  name: string;
  selected?: boolean;
  element: IFormElement;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const CardElement = ({
  id,
  index,
  moveCard,
  name,
  element,
  selected,
}: CardElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{}, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${selected ? 'bg-teal-300' : ''} cursor-move flex flex-row relative h-20 p-2 my-1 rounded-md`}
      data-handler-id={handlerId}
      id={id}
      name={name}
    >
      <div className='absolute top-0 right-3 flex flex-row justify-between w-10 z-10'>
        <span
          name={`remove-${id}`}
          className='cursor-pointer font-bold vx-icon vx-apps size-sm hover:bg-gray-400 hover:text-white rounded-full px-0.5'
        ></span>
        <span
          name={`setting-${id}`}
          className='cursor-pointer font-bold vx-icon vx-settings size-sm hover:bg-gray-400 hover:text-white rounded-full px-0.5'
        ></span>
      </div>
      <div className='relative w-full'>
        <h5 className='font-semibold'>
          {element.label ? element.label : 'name'}{' '}
        </h5>
        <p className='font-thin'>
          {element.description ? element.description : 'description'}{' '}
        </p>
        <span className='absolute bottom-0 right-0 font-extralight text-xs'>
          {element.type}
        </span>
      </div>
    </div>
  );
};
