import React, { useState } from 'react';
import { DateUtils } from '@/utils/utilities/dates';
import ShowFiles from '@/components/common/file/show.file';

export interface IReport {
  id: number;
  shiftId: number;
  description: string;
  requestDate: string | null;
  updatedAt: string;
  createdAt: string;
  date: string;
  request: boolean;
  resource: any[];
  form?: {
    id: number;
    description: string;
    title: string;
    category: string;
  };
}

interface ReportInfoProps {
  reports?: IReport[];
  data?: { reports: IReport[] };
  onViewDetails?: (report: IReport) => void;
}

const ReportInfo: React.FC<ReportInfoProps> = ({
  reports: directReports,
  data,
  onViewDetails,
}) => {
  const reports: IReport[] = directReports ?? data?.reports ?? [];
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleDetails = (report: IReport) => {
    setExpandedId(expandedId === report.id ? null : report.id);
    onViewDetails?.(report);
  };

  return (
    <div className='rounded-lg p-4 w-full'>
      {/* Header */}
      <div className='flex items-center justify-between pb-2 mb-4'>
        <h2 className='text-base font-medium'>Reportes del Turno</h2>
        <span className='bg-cyan-100 text-cyan-800 text-xs font-semibold px-3 py-1 rounded-full'>
          {reports.length} Reporte{reports.length !== 1 && 's'}
        </span>
      </div>

      <div className='divide-y divide-gray-200'>
        {reports.map((report) => {
          const isRequested = report.request;
          const statusLabel = isRequested ? 'Solicitado' : 'No solicitado';
          const statusColor = isRequested ? 'text-green-500' : 'text-red-500';
          const statusIcon = isRequested ? 'vx-icon-324' : 'vx-icon-323';

          const requestDate = report.requestDate
            ? DateUtils.dateToFrontend(report.requestDate, {
                time: true,
                format: 'DD/MM/YYYY HH:mm',
              })
            : '—';
          const receivedDate = DateUtils.dateToFrontend(report.createdAt, {
            time: true,
            format: 'DD/MM/YYYY HH:mm',
          });
          const updatedDate = DateUtils.dateToFrontend(report.updatedAt, {
            time: true,
            format: 'DD/MM/YYYY HH:mm',
          });

          const hasAttachments = report.resource?.length > 0;
          const hasForm = !!report.form;
          const showToggle = hasAttachments || hasForm;
          const isExpanded = expandedId === report.id;

          const buttonLabel = isExpanded ? 'Ocultar detalles' : 'Ver detalles';

          return (
            <React.Fragment key={report.id}>
              <div className='grid grid-cols-12 gap-x-4 items-center py-3 text-sm'>
                {/* Estado */}
                <div className='col-span-2 flex items-center space-x-2'>
                  <span
                    className={`vox-icon ${statusIcon} ${statusColor}`}
                  ></span>
                  <p className={`${statusColor} font-medium`}>{statusLabel}</p>
                </div>

                {/* Fechas */}
                <div className='col-span-3 space-y-0.5'>
                  {isRequested && (
                    <>
                      <p className='leading-tight'>
                        <span className='font-semibold'>Solicitud:</span>{' '}
                        {requestDate}
                      </p>
                      <p className='leading-tight'>
                        <span className='font-semibold'>Recibido:</span>{' '}
                        {receivedDate}
                      </p>
                    </>
                  )}
                  <p className='leading-tight'>
                    <span className='font-semibold'>Reporte:</span>{' '}
                    {updatedDate}
                  </p>
                </div>

                {/* Tipo (titulo o archivos) */}
                <div className='col-span-2'>
                  {hasAttachments ? (
                    <div className='flex items-center bg-cyan-100 text-cyan-800 text-xs font-medium px-2 py-1 rounded-full w-12'>
                      <span className='vox-icon vx-icon-006 mr-1'></span>
                      {report.resource.length}
                    </div>
                  ) : hasForm ? (
                    <p className='text-sm'>
                      <span className='font-semibold'>Formulario:</span>{' '}
                      {report.form?.title}
                    </p>
                  ) : null}
                </div>

                {/* Descripción */}
                <div className='col-span-3'>
                  <p className='truncate leading-tight'>{report.description}</p>
                </div>

                {/* Botón ver/ocultar */}
                {showToggle && (
                  <div className='col-span-2 text-right'>
                    <button
                      onClick={() => toggleDetails(report)}
                      className='text-cyan-600 text-xs flex items-center justify-end hover:underline'
                    >
                      {buttonLabel}
                      <span className='ml-1 vox-icon vx-icon-004 text-cyan-600'></span>
                    </button>
                  </div>
                )}
              </div>

              {/* Detalle expandido: archivos */}
              {isExpanded && hasAttachments && (
                <div className='p-4 bg-gray-50'>
                  <ShowFiles resources={report.resource} />
                </div>
              )}

              {/* Detalle expandido: formulario */}
              {isExpanded && !hasAttachments && hasForm && (
                <div className='p-4 bg-gray-50 grid grid-cols-4 items-center gap-x-4'>
                  <p className='text-sm'>
                    <span className='font-semibold'>Título:</span>{' '}
                    {report.form?.title}
                  </p>
                  <p className='text-sm'>
                    <span className='font-semibold'>Categoría:</span>{' '}
                    {report.form?.category ?? 'Sin categoría'}
                  </p>
                  <p className='text-sm'>
                    <span className='font-semibold'>Descripción:</span>{' '}
                    {report.form?.description}
                  </p>
                  <div className='text-right'>
                    <button
                      onClick={() => toggleDetails(report)}
                      className='text-cyan-600 text-xs flex items-center justify-end hover:underline'
                    >
                      Ver reporte de formulario
                      <span className='ml-1 vox-icon vx-icon-004 text-cyan-600'></span>
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}

        {reports.length === 0 && (
          <div className='py-8 text-center text-gray-500'>
            No hay reportes para mostrar
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportInfo;
