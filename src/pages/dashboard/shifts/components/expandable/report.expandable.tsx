import { Chip } from '@/components/common/chip/chip';

const ReportInfo = ({ data = {} }: any) => {
  const reports = data.reports || [
    {
      status: 'Solicitado',
      statusColor: 'text-green-600',
      icon: '324',
      requestDate: '11/04/2024 19:00',
      reportDate: '11/04/2024 20:00',
      description: 'Esta es una descripción de prueba, para realizar...',
      comments: 2,
      detailsLink: '#',
    },
    {
      status: 'No Solicitado',
      statusColor: 'text-red-600',
      icon: '323',
      requestDate: '11/04/2024 19:00',
      reportDate: '11/04/2024 20:00',
      description: 'Esta es una descripción de prueba, para realizar...',
      comments: 2,
      detailsLink: '#',
    },
    {
      status: 'Solicitado',
      statusColor: 'text-green-600',
      icon: '324',
      requestDate: '11/04/2024 19:00',
      reportDate: '11/04/2024 20:00',
      description: 'Esta es una descripción de prueba, para realizar...',
      comments: 2,
      detailsLink: '#',
    },
  ];

  return (
    <div className='bg-b-light-dark dark:bg-b-dark-light rounded-lg shadow-sm p-4 w-full text-t-light dark:text-t-dark'>
      <div className='flex items-center justify-between border-b pb-2 mb-4 border-b-light dark:border-b-dark'>
        <h2 className='font-medium'>Reportes del Turno</h2>
        <Chip label={`${reports.length} Reportes`} color='primary' />
      </div>

      <div className='space-y-4'>
        {reports.map((report: any, index: number) => (
          <div key={index} className='grid grid-cols-12 gap-4 items-center'>
            {/* Icono */}
            <div className='col-span-1'>
              {report.status === 'Solicitado' ? (
                <span
                  className={`vox-icon vx-icon-${report.icon} !text-secondary`}
                ></span>
              ) : (
                <span
                  className={`vox-icon vx-icon-${report.icon} !text-error`}
                ></span>
              )}
            </div>

            {/* Estado */}
            <div className='col-span-2'>
              {report.status === 'Solicitado' ? (
                <p className='text-secondary'>{report.status}</p>
              ) : (
                <p className='text-error'>{report.status}</p>
              )}
            </div>

            {/* Fechas */}
            <div className='col-span-3'>
              <p className=''>
                Solicitud: {report.requestDate.split(' ')[0]}{' '}
                {report.requestDate.split(' ')[1]}
              </p>
              <p className=''>
                Reporte: {report.reportDate.split(' ')[0]}{' '}
                {report.reportDate.split(' ')[1]}
              </p>
            </div>

            {/* Descripción */}
            <div className='col-span-3'>
              <p className='text truncate'>{report.description}</p>
            </div>

            {/* Comentarios */}
            <div className='col-span-1 text-center'>
              <Chip label={`${report.comments} Comentarios`} color='primary' />
            </div>

            {/* Ver detalles */}
            <div className='col-span-2 text-right'>
              <a
                href={report.detailsLink}
                className='text-primary text-xs flex items-center justify-end'
              >
                Ver detalles
                <span className='ml-2 vox-icon vx-icon-004 !text-primary'></span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportInfo;
