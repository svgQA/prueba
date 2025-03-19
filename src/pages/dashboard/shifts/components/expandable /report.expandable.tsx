const ReportInfo = ({ data = {} }: any) => {
  const reports = data.reports || [
    {
      status: 'Solicitado',
      statusColor: 'text-green-600',
      icon: '✔️',
      requestDate: '11/04/2024 19:00',
      reportDate: '11/04/2024 20:00',
      description: 'Esta es una descripción de prueba, para realizar...',
      comments: 2,
      detailsLink: '#',
    },
    {
      status: 'No Solicitado',
      statusColor: 'text-red-600',
      icon: '⚠️',
      requestDate: '11/04/2024 19:00',
      reportDate: '11/04/2024 20:00',
      description: 'Esta es una descripción de prueba, para realizar...',
      comments: 2,
      detailsLink: '#',
    },
    {
      status: 'Solicitado',
      statusColor: 'text-green-600',
      icon: '✔️',
      requestDate: '11/04/2024 19:00',
      reportDate: '11/04/2024 20:00',
      description: 'Esta es una descripción de prueba, para realizar...',
      comments: 2,
      detailsLink: '#',
    },
  ];

  return (
    <div class='p-4 bg-white shadow-lg rounded-lg'>
      <div class='flex items-center justify-between border-b pb-2 mb-4'>
        <h2 class='text-lg font-semibold'>Reportes del Turno</h2>
        <span class='px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full'>
          {reports.length} Reportes
        </span>
      </div>
      <div class='space-y-2'>
        {reports.map((report: any, index: any) => (
          <div
            key={index}
            class='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
          >
            <div class='flex items-center gap-2'>
              <span class={report.statusColor}>{report.icon}</span>
              <div>
                <p class={`font-semibold ${report.statusColor}`}>
                  {report.status}
                </p>
                <p class='text-xs text-gray-500'>
                  Solicitud: {report.requestDate}
                </p>
                <p class='text-xs text-gray-500'>
                  Reporte: {report.reportDate}
                </p>
              </div>
            </div>
            <p class='text-xs text-gray-600 truncate w-40'>
              {report.description}
            </p>
            <div class='flex items-center gap-2'>
              <button class='px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full'>
                💬 {report.comments}
              </button>
              <a href={report.detailsLink} class='text-blue-500 text-xs'>
                Ver detalles ➝
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportInfo;
