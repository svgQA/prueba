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
      case ELEMENT_TYPE.TITLE:
        return <div className='text-sm text-gray-600'>{element.label}</div>;
      // case ELEMENT_TYPE.PARAGRAPH:
      //   return (
      //     <div className='text-sm'>
      //       <div className='font-medium'>{element.label}</div>
      //       {/* <div className='text-gray-600'>{element.description}</div> */}
      //     </div>
      //   );
      case ELEMENT_TYPE.INPUT:
        return (
          <div className='text-sm'>
            <input
              type='text'
              placeholder='Text input'
              className='border rounded w-full text-gray-500'
              disabled
            />
          </div>
        );
      case ELEMENT_TYPE.TEXT_AREA:
        return (
          <div className='text-sm'>
            <textarea placeholder='Text area' className='w-full' disabled />
          </div>
        );
      case ELEMENT_TYPE.NUMBER_INPUT:
        return (
          <div className='text-sm'>
            <input
              type='number'
              placeholder='123'
              className='w-full'
              disabled
            />
          </div>
        );
      case ELEMENT_TYPE.DROPDOWN:
        return (
          <div className='text-sm'>
            <select className='w-full' disabled>
              <option>Select an option</option>
            </select>
          </div>
        );
      case ELEMENT_TYPE.RADIO_BUTTON:
        return (
          <div className='text-sm flex gap-4'>
            <label className='flex items-center'>
              <input type='radio' disabled className='mr-1' />
              Option 1
            </label>
            <label className='flex items-center'>
              <input type='radio' disabled className='mr-1' />
              Option 2
            </label>
          </div>
        );
      case ELEMENT_TYPE.CHECK_BOX:
        return (
          <div className='text-sm flex gap-4'>
            <label className='flex items-center'>
              <input type='checkbox' disabled className='mr-1' />
              Option 1
            </label>
            <label className='flex items-center'>
              <input type='checkbox' disabled className='mr-1' />
              Option 2
            </label>
          </div>
        );
      case ELEMENT_TYPE.SWITCH:
        return (
          <div className='text-sm'>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input type='checkbox' className='sr-only peer' disabled />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        );
      case ELEMENT_TYPE.DATE:
        return (
          <div className='text-sm'>
            <input
              type='date'
              className='border rounded p-1 w-full text-gray-500'
              disabled
            />
          </div>
        );
      case ELEMENT_TYPE.TIME:
        return (
          <div className='text-sm'>
            <input type='time' className='w-full' disabled />
          </div>
        );
      case ELEMENT_TYPE.RATING:
        return (
          <div className='text-sm flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>★</span>
            ))}
          </div>
        );
      case ELEMENT_TYPE.IMAGE:
        return (
          <div className='text-sm text-center'>Click or drag image here</div>
        );
      case ELEMENT_TYPE.SIGNATURE:
        return <div className='text-sm'>Signature pad</div>;
      case ELEMENT_TYPE.QR:
        return <div className='text-sm'>QR Code</div>;
      case ELEMENT_TYPE.AUDIO:
        return (
          <div className='text-sm'>
            <span>🎤</span>
            <div className='h-1 flex-1'></div>
          </div>
        );
      case ELEMENT_TYPE.CALCULATE:
        return (
          <div className='text-sm'>
            <input
              type='text'
              placeholder='Calculation result'
              className='border'
              disabled
            />
          </div>
        );
      case ELEMENT_TYPE.LOCATION:
        return <div className='text-sm'>Map location picker</div>;
      case ELEMENT_TYPE.FILES:
        return (
          <div className='text-sm border-2 border-dashed rounded p-4 text-center'>
            Click or drag files here
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${selected ? 'bg-teal-300' : ''} flex flex-row relative my-1 h-fit py-1 pl-2`}
      id={id}
      name={name}
    >
      <div className='absolute top-1 right-3 flex flex-row justify-end w-10 z-10 items-center'>
        {/* <div className='text-xs capitalize bg-gray-200 rounded-sm px-1 text-gray-600 font-medium h-fit mx-1'>
          {element.type}
        </div>
        <span
          name={`remove-${id}`}
          className='cursor-pointer font-bold vx-icon vx-apps size-sm hover:bg-gray-400 hover:text-white rounded-full px-0.5'
        ></span>
        <span
          name={`setting-${id}`}
          className='cursor-pointer font-bold vx-icon vx-settings size-sm hover:bg-gray-400 hover:text-white rounded-full px-0.5'
        ></span> */}
      </div>
      <div className='relative w-full h-fit'>
        <div className='flex flex-row justify-between'>
          <h5
            className={`font-semibold ${element.elements || element.type === ELEMENT_TYPE.TITLE ? 'text-lg' : 'text-sm'}`}
          >
            {element.label
              ? element.label
              : `Title ${element.elements ? 'Section' : 'Element'}`}
          </h5>
          {element.elements && <span className='vox-icon vx-icon-005' />}
        </div>
        {element.type === ELEMENT_TYPE.TITLE && (
          <p className='font-thin text-sm'>
            {element.description ? element.description : 'Element Description'}{' '}
          </p>
        )}
        {renderPreviewElement()}
        {element.elements &&
          element.elements.map((subElement, index) => (
            <CardElement
              key={index}
              id={`${id}-${index}`}
              name={`${name}-${index}`}
              element={subElement}
              selected={selected}
            />
          ))}
      </div>
    </div>
  );
};
