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
    console.log('Enviando mensaje con:', titleMsg, descMsg);
    // Aquí podrías implementar tu lógica de envío
  };

  return (
    <div className='w-full bg-white p-4 rounded-lg shadow-md'>
      <h4 className='text-gray-800 font-semibold mb-3'>
        Envío de notificaciones
      </h4>

      {/* Inputs para escribir título y descripción, y un botón para enviar */}
      <div className='mt-4 flex flex-col md:flex-row gap-4'>
        <input
          type='text'
          placeholder='Asunto del mensaje'
          className='border p-2 rounded w-full md:w-1/2'
          value={titleMsg}
          onInput={(e) => setTitleMsg(e.currentTarget.value)}
        />
        <input
          type='text'
          placeholder='Descripción'
          className='border p-2 rounded w-full md:w-1/2'
          value={descMsg}
          onInput={(e) => setDescMsg(e.currentTarget.value)}
        />
      </div>
      <button
        onClick={handleSend}
        className='mt-3 px-4 py-2 bg-blue-500 text-white rounded shadow'
      >
        Enviar
      </button>
    </div>
  );
};
