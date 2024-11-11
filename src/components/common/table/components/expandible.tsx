export const RowExpandedContent = ({ row }: { row: any }) => {
  if (row.original.moreInfo) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white shadow rounded-lg'>
        {/* Columna de Descripción */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Descripción</h3>
          <p>{row.original.moreInfo}</p>
        </div>

        {/* Columna de Detalles */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Detalles</h3>
          <p>
            <strong>Supervisor:</strong> {row.original.supervisor}
          </p>
          <p>
            <strong>Turno relacionado:</strong> {row.original.relatedShift}
          </p>
          <p>
            <strong>Actualizado por:</strong> {row.original.updatedBy}
          </p>
          <p>
            <strong>Lugar:</strong> {row.original.location}
          </p>
        </div>

        {/* Columna de Cliente e Información */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Información del cliente</h3>
          <p>
            <strong>Cliente:</strong> {row.original.client}
          </p>
          <p>
            <strong>Ciudad:</strong> {row.original.city}
          </p>
          <p>
            <strong>Compañía:</strong> {row.original.company}
          </p>
          <p>
            <strong>Dirección Prueba:</strong> {row.original.address}
          </p>
        </div>

        {/* Columna del Mapa */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Mapa</h3>
          <img
            src={row.original.mapUrl}
            alt='Mapa de ubicación'
            className='w-full h-auto'
          />
        </div>

        {/* Columna de Archivos Adjuntos */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Archivos adjuntos</h3>
          <ul className='space-y-2'>
            {row.original.attachments &&
              row.original.attachments.map((attachment: any, index: number) => (
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
                    {attachment.type === 'pdf' && (
                      <span className='mr-2'>📄</span>
                    )}
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
  }

  return <div>No data available for expansion</div>;
};
