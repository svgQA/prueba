import { FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';
import { useState } from 'preact/hooks';

export const ExpandableUser: FunctionComponent<IExpandableProps> = (
  {
    // row,
  }
) => {
  // State locales para manejar los inputs
  const [titleMsg, setTitleMsg] = useState('');
  const [descMsg, setDescMsg] = useState('');

  const handleSend = () => {
    // console.log('Enviando mensaje con:', titleMsg, descMsg);
    // Aquí podrías implementar tu lógica de envío
  };

  return (
    <div className='w-full bg-b-light p-4 rounded-lg shadow-md block'>
      <h4 className='text-gray-800 font-semibold mb-3'>
        Envío de notificaciones
      </h4>

      {/* Inputs para escribir título y descripción, y un botón para enviar */}
      <div className='mt-4 block  md:flex-row gap-4 '>
        <input
          type='text'
          placeholder='Asunto del mensaje'
          className='border border-gray-300 pl-4 p-2 rounded-sm  md:w-full '
          value={titleMsg}
          onInput={(e) => setTitleMsg(e.currentTarget.value)}
        />
      </div>
      <div className='mt-4 flex w-full md:flex-row gap-4 '>
        <textarea
          placeholder='Descripción'
          className='border border-gray-300 pl-4 p-2 rounded-sm w-full md:w-full'
          value={descMsg}
          onInput={(e) => setDescMsg(e.currentTarget.value)}
        />
      </div>
      <button
        onClick={handleSend}
        className='mt-3 px-4 py-2 bg-primary text-white rounded-full shadow w-48'
      >
        Enviar
      </button>
    </div>
  );
};
