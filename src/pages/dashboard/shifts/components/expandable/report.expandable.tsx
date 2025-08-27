import React, { useState } from 'react';
import ShowFiles from '@/components/common/file/show.file';
import { useTranslation } from 'react-i18next';
import { TaskCard } from '@/pages/settings/shifts/task/create/task.card';
import { FormService } from '@/services';
import {
  setResponse,
  RESPONSE_MODE_SERVICE,
  VIEW_NAME,
  currentView,
} from '@/pages/dashboard/forms/response/store/response';
import { FormattedDate } from '@/components/compose/forms';
import { Badge } from '@/components/common/badge/badge';
import { useLocation } from 'wouter';
export interface IReport {
  id: number;
  shiftId: number;
  description: string;
  responseId: string;
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
  task?: any;
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
  const { t } = useTranslation();
  const reports: IReport[] = directReports ?? data?.reports ?? [];
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [_, navigate] = useLocation();

  const toggleDetails = (report: IReport) => {
    setExpandedId(expandedId === report.id ? null : report.id);
    onViewDetails?.(report);
  };

  const toggleDetailsForm = async (report: IReport) => {
    if (!report.form?.id) return;

    // Si ya estaba abierto, lo cerramos
    if (selectedFormId === report.form.id) {
      setSelectedFormId(null);
      return;
    }
    if (!report?.responseId) return;
    const response = await FormService.get_one_response(report?.responseId);
    if (response.getStatus()) {
      const structure = response.getOne()?.structure;
      setSelectedFormId(report.form.id);

      setResponse(
        {
          mode: RESPONSE_MODE_SERVICE.UPDATE,
          id: report?.responseId,
          hold: true,
        },
        structure
      );
    }

    currentView.value = VIEW_NAME.REPORT; // o VIEW_NAME.INSPECT
    navigate('/forms');
  };

  return (
    <div className='rounded-lg w-full relative max-h-[300px] overflow-y-auto vox-scroll-design'>
      {/* Header */}
      <div className='absolute top-1 right-4'>
        <Badge
          label={'h_report'}
          status='info'
          icon='324'
          count={reports.length}
        />
      </div>

      <div className='divide-y dark:divide-b-dark-light divide-b-light-dark'>
        {reports?.map((report) => {
          const isRequested = report.request;

          const hasAttachments = report.resource?.length > 0;
          const hasForm = !!report.form;
          const showToggle = hasAttachments || hasForm;
          const isExpanded = expandedId === report.id;
          const buttonLabel = isExpanded ? t('hide') : t('show');

          return (
            <React.Fragment key={report.id}>
              <div className='w-full overflow-x-auto'>
                <div className='min-w-[1000px] grid grid-cols-12 gap-x-2 items-center py-2 text-sm'>
                  {/* Estado */}
                  <div className='col-span-2 flex items-center space-x-2'>
                    <Badge
                      label={isRequested ? 'requested' : 'no_requested'}
                      outline
                      status={isRequested ? 'info' : 'warning'}
                      icon='324'
                    />
                  </div>

                  {/* Fechas */}
                  <div className='col-span-3 space-y-0.5 flex flex-row gap-2'>
                    {isRequested && (
                      <>
                        <div className='flex flex-col'>
                          <span className='font-semibold'>
                            {t('requested')}:
                          </span>
                          <FormattedDate date={report.requestDate} />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-semibold'>
                            {t('received')}:
                          </span>
                          <FormattedDate date={report.createdAt} />
                        </div>
                      </>
                    )}
                    <div className='flex flex-col'>
                      <span className='font-semibold'>{t('h_report')}:</span>{' '}
                      <FormattedDate date={report.updatedAt} />
                    </div>
                  </div>

                  {/* Archivos o formulario */}
                  <div className='col-span-2'>
                    {hasAttachments ? (
                      <div className='flex items-center bg-cyan-100 text-cyan-800 text-xs font-medium px-2 py-1 rounded-full w-12'>
                        <span className='vox-icon vx-icon-006 mr-1'></span>
                        {report.resource.length}
                      </div>
                    ) : hasForm ? (
                      <p className='text-sm'>
                        <span className='font-semibold'>{t('h_title')}:</span>{' '}
                        {report.form?.title}
                      </p>
                    ) : null}
                  </div>

                  {/* Descripción */}
                  <div className='col-span-2'>
                    <p className='truncate leading-tight'>
                      {report.description}
                    </p>
                  </div>

                  {/* Tarea */}
                  <div className='col-span-2'>
                    {report.task && (
                      <TaskCard task={report.task} remove={false} />
                    )}
                  </div>

                  {/* Botón */}
                  {showToggle && (
                    <div className='col-span-1 text-right'>
                      <button
                        onClick={() => toggleDetails(report)}
                        className='text-cyan-600 text-xs flex items-center justify-end border-none'
                      >
                        {buttonLabel}
                        <span className='ml-1 vox-icon vx-icon-004 text-cyan-600'></span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Archivos */}
                {isExpanded && hasAttachments && (
                  <div className='p-4 bg-b-light-light dark:bg-b-dark-dark'>
                    <ShowFiles resources={report.resource} />
                  </div>
                )}

                {/* Formulario */}
                {isExpanded && !hasAttachments && hasForm && (
                  <div className='p-4 bg-b-light-light dark:bg-b-dark-dark'>
                    <div className='grid grid-cols-4 items-center gap-x-4'>
                      <p className='text-sm'>
                        <span className='font-semibold'>{t('h_title')}:</span>{' '}
                        {report.form?.title}
                      </p>
                      <p className='text-sm'>
                        <span className='font-semibold'>
                          {t('h_category')}:
                        </span>{' '}
                        {report.form?.category ?? `No ${t('h_category')}`}
                      </p>
                      <p className='text-sm'>
                        <span className='font-semibold'>
                          {t('description')}:
                        </span>{' '}
                        {report.form?.description}
                      </p>
                      <div className='text-right'>
                        <button
                          onClick={() => toggleDetailsForm(report)}
                          className='text-cyan-600 text-xs flex items-center justify-end border-none'
                        >
                          {t('show')}
                          <span className='ml-1 vox-icon vx-icon-004 text-cyan-600'></span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {reports.length === 0 && (
          <div className='py-8 text-center text-gray-500'>{t('empty')}</div>
        )}
      </div>
    </div>
  );
};

export default ReportInfo;
