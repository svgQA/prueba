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
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <input type='text' placeholder='Text input' disabled />
          </div>
        );
      case ELEMENT_TYPE.TEXT_AREA:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <textarea
              placeholder='Text area'
              className='w-full min-h-6'
              disabled
            />
          </div>
        );
      case ELEMENT_TYPE.NUMBER_INPUT:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
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
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1 flex flex-row'>
            <span className='vx-icon vx-icon-096' />
            <select className='w-full ml-2' disabled>
              <option>Select an option</option>
            </select>
          </div>
        );
      case ELEMENT_TYPE.RADIO_BUTTON:
        return (
          <div className='text-sm gap-3 flex flex-col mt-2'>
            <label className='flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors'>
              <input
                type='radio'
                disabled
                className='w-4 h-4 mr-3 accent-teal-600 cursor-pointer'
              />
              <span className='text-gray-700'>Option 1</span>
            </label>
            <label className='flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors'>
              <input
                type='radio'
                disabled
                className='w-4 h-4 mr-3 accent-teal-600 cursor-pointer'
              />
              <span className='text-gray-700'>Option 2</span>
            </label>
          </div>
        );
      case ELEMENT_TYPE.CHECK_BOX:
        return (
          <div className='text-sm gap-3 flex flex-col mt-2'>
            <label className='flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors'>
              <input
                type='checkbox'
                disabled
                className='w-4 h-4 mr-3 accent-teal-600 cursor-pointer border-gray-300'
              />
              <span className='text-gray-700'>Option 1</span>
            </label>
            <label className='flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors'>
              <input
                type='checkbox'
                disabled
                className='w-4 h-4 mr-3 accent-teal-600 cursor-pointer border-gray-300'
              />
              <span className='text-gray-700'>Option 2</span>
            </label>
          </div>
        );
      case ELEMENT_TYPE.SWITCH:
        return (
          <div className='text-sm mt-2'>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input type='checkbox' className='sr-only peer' disabled />
              <div className="w-8 h-4 bg-gray-300 rounded-full peer peer-checked:bg-teal-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0 after:left-0 after:bg-white after:border-2 after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>
        );
      case ELEMENT_TYPE.DATE:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1 flex flex-row items-center'>
            <span className='vx-icon vx-icon-025' />
            <input type='date' className='w-full pl-2' disabled />
          </div>
        );
      case ELEMENT_TYPE.TIME:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1 flex flex-row items-center'>
            <span className='vx-icon vx-icon-049' />
            <input type='time' className='w-full pl-2' disabled />
          </div>
        );
      case ELEMENT_TYPE.RATING:
        return (
          <div className='text-sm flex gap-1 p-2 justify-center'>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className='vox-icon vx-icon-260' />
            ))}
          </div>
        );
      case ELEMENT_TYPE.IMAGE:
        return (
          <div className='text-sm flex gap-6 p-2 flex-row justify-center'>
            <div className='w-28 h-16 bg-primary rounded-md flex flex-col items-center justify-center'>
              <span className='vx-icon vx-icon-264 size-xl mb-1' />
              Tomar Foto
            </div>
            <div className='w-28 h-16 bg-primary rounded-md flex flex-col items-center justify-center'>
              <span className='vx-icon vx-icon-199 size-xl mb-1' />
              Seleccionar
            </div>
          </div>
        );
      case ELEMENT_TYPE.SIGNATURE:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <div className='h-24 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed'>
              <div className='text-center text-gray-500'>
                <span className='vx-icon vx-icon-171 text-2xl block mb-1' />
                <span>Firma aquí</span>
              </div>
            </div>
          </div>
        );
      case ELEMENT_TYPE.QR:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <div className='h-24 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed'>
              <div className='text-center text-gray-500'>
                <span className='vx-icon vx-icon-132 text-2xl block mb-1' />
                <span>Escanear código QR</span>
              </div>
            </div>
          </div>
        );
      case ELEMENT_TYPE.AUDIO:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <div className='h-24 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed'>
              <div className='text-center text-gray-500'>
                <span className='vx-icon vx-icon-082 text-2xl block mb-1' />
                <span>Graba un Audio</span>
              </div>
            </div>
          </div>
        );
      case ELEMENT_TYPE.CALCULATE:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <input
              type='text'
              placeholder='Calculation result'
              className='w-full'
              disabled
            />
          </div>
        );
      case ELEMENT_TYPE.LOCATION:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <div className='h-24 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed'>
              <div className='text-center text-gray-500'>
                <span className='vx-icon vx-icon-289 text-2xl block mb-1' />
                <span>La Ubicación</span>
              </div>
            </div>
          </div>
        );
      case ELEMENT_TYPE.FILES:
        return (
          <div className='text-sm border border-zinc-300 rounded-md p-2 mt-1'>
            <div className='h-24 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed'>
              <div className='text-center text-gray-500'>
                <span className='vx-icon vx-icon-065 text-2xl block mb-1' />
                <span>Agregar Archivos</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${selected ? 'bg-teal-300' : ''} flex flex-row relative my-1 h-fit`}
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
        <div className='flex flex-row justify-between items-center'>
          <h5
            className={`font-semibold ${element.elements || element.type === ELEMENT_TYPE.TITLE ? 'text-lg' : 'text-sm'}`}
          >
            {element.label
              ? element.label
              : `Title ${element.elements ? 'Section' : 'Element'}`}
          </h5>
          {element.elements && <span className='vox-icon vx-icon-001' />}
        </div>
        {(element.type === ELEMENT_TYPE.TITLE ||
          element.type == ELEMENT_TYPE.SECTION) && (
          <p
            className={`font-thin text-sm ${element.type === ELEMENT_TYPE.SECTION ? 'border-b-2 pb-3' : ''}`}
          >
            {element.description ? element.description : 'Element Description'}
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
