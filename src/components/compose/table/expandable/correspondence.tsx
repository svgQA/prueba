// src/components/compose/table/expandable/correspondence.tsx

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { IExpandableProps } from './interface'; // Ajusta si tu interface se ubica en otro lado

export const ExpandableCorrespondence: FunctionComponent<IExpandableProps> = ({
  row,
}) => {
  // Podríamos usar un estado local para "messageToOwner"
  const [titleMsg, setTitleMsg] = useState('');
  const [message, setMessage] = useState(row.messageToOwner || '');

  const handleSend = () => {
    // Aquí podrías hacer un fetch/axios para "enviar" la data
    // o simplemente loguear
    alert(`Mensaje enviado al propietario: ${message}`);
  };

  return (
    <div className='w-full p-4 bg-b-light rounded-lg shadow space-y-4'>
      <h4 className='font-semibold text-gray-800 mb-3'>Enviar notificación</h4>

      <div className='flex flex-col md:flex-row gap-4'>
        {/* Tipo de paquete */}
        <div className='flex-1'>
          <label className='text-gray-600 text-sm'>Tipo de Paquete:</label>
          <div className='text-gray-900 font-medium'>{row.packageType}</div>
        </div>

        {/* Observación */}
        <div className='flex-1'>
          <label className='text-gray-600 text-sm'>Observación:</label>
          <div className='text-gray-900'>
            {row.observation || 'Sin observaciones'}
          </div>
        </div>
      </div>

      {/* Campo para escribir mensaje al propietario */}
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
          value={message}
          onInput={(e) => setMessage(e.currentTarget.value)}
        />
      </div>

      {/* Botón para enviar el mensaje */}
      <button
        onClick={handleSend}
        className='mt-3 px-4 py-2 bg-primary text-white rounded-full shadow w-48'
      >
        Enviar
      </button>
    </div>
  );
};
