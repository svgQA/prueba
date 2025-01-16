// src/components/compose/table/expandable/correspondence.tsx

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { IExpandableProps } from './interface'; // Ajusta si tu interface se ubica en otro lado

/**
 * Se asume que `row` es de tipo ICorrespondence.
 * Mostrar en el expansible:
 * - Tipo de paquete
 * - Observación
 * - Mensaje para el propietario
 * - Botón para "enviar" el mensaje
 */
export const ExpandableCorrespondence: FunctionComponent<IExpandableProps> = ({
  row,
}) => {
  // Podríamos usar un estado local para "messageToOwner"
  const [message, setMessage] = useState(row.messageToOwner || '');

  const handleSend = () => {
    // Aquí podrías hacer un fetch/axios para "enviar" la data
    // o simplemente loguear
    alert(`Mensaje enviado al propietario: ${message}`);
  };

  return (
    <div className='w-full p-4 bg-white rounded-lg shadow space-y-4'>
      <h4 className='font-semibold text-gray-800 mb-3'>
        Información Adicional
      </h4>

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
      <div>
        <label className='text-gray-600 text-sm'>Mensaje al Propietario:</label>
        <textarea
          value={message}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
          className='w-full mt-1 p-2 border border-gray-300 rounded'
          rows={3}
          placeholder='Escribe un mensaje...'
        />
      </div>

      {/* Botón para enviar el mensaje */}
      <div className='text-right'>
        <button
          onClick={handleSend}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Enviar
        </button>
      </div>
    </div>
  );
};
