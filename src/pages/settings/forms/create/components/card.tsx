import { ELEMENT_TYPE, IElement } from '../store';

export interface CardElementProps {
  id: string;
  name: string;
  selected?: boolean;
  element: IElement;
}

export const CardElement = ({
  id,
  name,
  element,
  selected,
}: CardElementProps) => {
  const renderPreviewElement = () => {
    switch (element.type) {
      case ELEMENT_TYPE.INPUT:
        return (
          <input type='text' disabled className='w-full border rounded p-1' />
        );
      // case 'area':
      //   return <textarea disabled className='w-full border rounded p-1' />;
      case ELEMENT_TYPE.NUMBER:
        return (
          <input type='number' disabled className='w-full border rounded p-1' />
        );
      // case 'checkbox':
      //   return <input type='checkbox' disabled className='border rounded' />;
      // case ELEMENT_TYPE:
      //   return (
      //     <select className='w-full border rounded'>
      //       <option>Select...</option>
      //       <option>opcion_1</option>
      //       <option>opcion_2</option>
      //       <option>opcion_3</option>
      //       <option>opcion_4</option>
      //       <option>opcion_5</option>
      //     </select>
      //   );
      // case 'switch':
      //   return (
      //     <div className='w-10 h-6 bg-gray-300 rounded-full relative'>
      //       <div className='absolute w-5 h-5 bg-white rounded-full left-0.5 top-0.5 shadow'></div>
      //     </div>
      //   );
      // case 'title':
      //   return <h3 className='font-bold'>Sample Title</h3>;
      // case 'paragraph':
      //   return <p className='text-sm'>Sample paragraph text</p>;
      // case 'photo':
      //   return (
      //     <div className='w-full h-20 bg-gray-200 flex items-center justify-center'>
      //       Photo
      //     </div>
      //   );
      // case 'qr':
      // case 'camera':
      // case 'audio':
      // case 'sign':
      //   return (
      //     <div className='w-full h-20 border-2 border-dashed border-gray-300 flex items-center justify-center'>
      //       {element.type.toUpperCase()}
      //     </div>
      //   );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${selected ? 'bg-teal-300' : ''} cursor-move flex flex-row relative my-1 border-b-[1px] h-fit py-1 pl-2`}
      id={id}
      name={name}
    >
      <div className='absolute top-1 right-3 flex flex-row justify-end w-10 z-10 items-center'>
        <div className='text-xs capitalize bg-gray-200 rounded-sm px-1 text-gray-600 font-medium h-fit mx-1'>
          {element.type}
        </div>
        <span
          name={`remove-${id}`}
          className='cursor-pointer font-bold vx-icon vx-apps size-sm hover:bg-gray-400 hover:text-white rounded-full px-0.5'
        ></span>
        <span
          name={`setting-${id}`}
          className='cursor-pointer font-bold vx-icon vx-settings size-sm hover:bg-gray-400 hover:text-white rounded-full px-0.5'
        ></span>
      </div>
      <div className='relative w-full h-fit'>
        <h5 className='font-semibold text-sm'>
          {element.label ? element.label : 'name'}{' '}
        </h5>
        <p className='font-thin text-sm'>
          {element.description ? element.description : 'description'}{' '}
        </p>
        {renderPreviewElement()}
      </div>
    </div>
  );
};
