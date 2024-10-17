import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface ExpandableContentProps {
  data: {
    id?: string | number;
    name?: string;
    noveltyType?: string;
    noveltyDate?: string;
    priority?: string;
    description?: string;
    supervisor?: string;
    relatedShift?: string;
    updatedBy?: string;
    location?: string;
    client?: string;
    city?: string;
    company?: string;
    address?: string;
    mapUrl?: string;
    attachments?: {
      type?: 'image' | 'pdf' | 'audio' | 'excel';
      url?: string;
      name?: string;
    }[];
  };
}

export interface PrioritySection {
  title: string;
  items: ExpandableContentProps['data'][];
}

interface ExpandablePrioritySectionProps {
  section: PrioritySection;
}

export const ExpandablePrioritySection: FunctionComponent<
  ExpandablePrioritySectionProps
> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='mb-4'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex items-center justify-between w-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
      >
        <span className='font-semibold'>{section.title}</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isExpanded && (
        <div className='mt-2 space-y-4'>
          {section.items.map((item, index) => (
            <ExpandableContent key={index} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ExpandableContent: FunctionComponent<ExpandableContentProps> = ({
  data,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white shadow rounded-lg'>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Descripción</h3>
        <p>{data.description}</p>
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Detalles</h3>
        <p>
          <strong>Supervisor:</strong> {data.supervisor}
        </p>
        <p>
          <strong>Turno relacionado:</strong> {data.relatedShift}
        </p>
        <p>
          <strong>Actualizado por:</strong> {data.updatedBy}
        </p>
        <p>
          <strong>Lugar:</strong> {data.location}
        </p>
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Información del cliente</h3>
        <p>
          <strong>Cliente:</strong> {data.client}
        </p>
        <p>
          <strong>Ciudad:</strong> {data.city}
        </p>
        <p>
          <strong>Compañía:</strong> {data.company}
        </p>
        <p>
          <strong>Dirección:</strong> {data.address}
        </p>
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Mapa</h3>
        <img
          src={data.mapUrl}
          alt='Mapa de ubicación'
          className='w-full h-auto'
        />
      </div>
      <div className='md:col-span-1'>
        <h3 className='font-semibold mb-2'>Archivos adjuntos</h3>
        <ul className='space-y-2'>
          {data?.attachments?.map((attachment, index) => (
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
        </ul>
      </div>
    </div>
  );
};
