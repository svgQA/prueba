import { FunctionComponent } from 'preact';

interface Attachment {
  type: 'image' | 'pdf' | 'audio' | 'excel';
  url: string;
  name: string;
}

interface ExpandableContentProps {
  description: string;
  supervisor: string;
  relatedShift: string;
  updatedBy: string;
  location: string;
  client: string;
  city: string;
  company: string;
  address: string;
  mapUrl: string;
  attachments: Attachment[];
}

export const ExpandableRow: FunctionComponent<ExpandableContentProps> = ({
  description,
  supervisor,
  relatedShift,
  updatedBy,
  location,
  client,
  city,
  company,
  address,
  mapUrl,
  attachments,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white shadow rounded-lg'>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Descripción</h3>
        <p>{description}</p>
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Detalles</h3>
        <p>
          <strong>Supervisor:</strong> {supervisor}
        </p>
        <p>
          <strong>Turno relacionado:</strong> {relatedShift}
        </p>
        <p>
          <strong>Actualizado por:</strong> {updatedBy}
        </p>
        <p>
          <strong>Lugar:</strong> {location}
        </p>
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Información del cliente</h3>
        <p>
          <strong>Cliente:</strong> {client}
        </p>
        <p>
          <strong>Ciudad:</strong> {city}
        </p>
        <p>
          <strong>Compañía:</strong> {company}
        </p>
        <p>
          <strong>Dirección:</strong> {address}
        </p>
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Mapa</h3>
        <img src={mapUrl} alt='Mapa de ubicación' className='w-full h-auto' />
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Archivos adjuntos</h3>
        <ul className='space-y-2 overflow-auto max-h-48'>
          {attachments.slice(0, 4).map((attachment, index) => (
            <li key={index}>
              <a
                href={attachment.url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-blue-600 hover:underline'
              >
                {attachment.type === 'image' && (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className='w-8 h-8 mr-2 object-cover'
                  />
                )}
                {attachment.type === 'pdf' && <span className='mr-2'>📄</span>}
                {attachment.type === 'audio' && (
                  <span className='mr-2'>🔊</span>
                )}
                {attachment.type === 'excel' && (
                  <span className='mr-2'>📊</span>
                )}
                {attachment.name}
              </a>
            </li>
          ))}
          {attachments.length > 4 && (
            <li>
              <span>+ {attachments.length - 4} más</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
