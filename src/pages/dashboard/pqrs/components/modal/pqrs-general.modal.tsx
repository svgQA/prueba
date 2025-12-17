import { Signal } from '@preact/signals';
import { ComponentChildren, FunctionalComponent } from 'preact';

import { useTranslation } from 'react-i18next';

import ShowFiles from '@/components/common/file/show.file';
import MapLibreShowPoints from '@/components/common/map/MapLibreShowPoints';
import { TextEllipsis } from '@/components/common/text-ellipsis';

import { ICPqrsRequest } from '../../utils/interface';

export interface IProps {
  pqrs: Signal<ICPqrsRequest | null>;
}

export interface ITextInformationProps {
  label: string;
  value: string | number | null | undefined;
}

const SectionCard = ({
  title,
  icon,
  children,
  className = '',
}: {
  title?: string;
  icon?: string;
  children: ComponentChildren;
  className?: string;
}) => (
  <div
    class={`rounded-2xl border border-gray-border/70 dark:border-b-dark-light bg-white/90 dark:bg-b-dark-light/90 shadow-sm backdrop-blur-sm ${className}`}
  >
    {(icon || title) && (
      <div class='flex items-center gap-2 px-4 py-3 border-b border-gray-border/60 dark:border-b-dark-light'>
        {icon && <span class='text-lg'>{icon}</span>}
        {title && (
          <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide'>
            {title}
          </h4>
        )}
      </div>
    )}
    <div class='p-4 space-y-4'>{children}</div>
  </div>
);

const InfoPill: FunctionalComponent<{
  icon: string;
  label: string;
  value?: string | number | null;
}> = ({ icon, label, value }) => {
  const { t } = useTranslation();

  if (!value) return null;

  return (
    <div class='inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-b-dark/70 border border-gray-border/60 dark:border-b-dark-light shadow-sm'>
      <span>{icon}</span>
      <div class='flex flex-col leading-tight'>
        <span class='text-[10px] uppercase tracking-[0.12em] text-gray-text-light dark:text-b-light-dark font-semibold'>
          {t(label)}
        </span>
        <span class='text-sm text-t-light dark:text-white font-medium'>
          {typeof value === 'string' ? t(value) : value}
        </span>
      </div>
    </div>
  );
};

const PqrsGeneralModal = ({ pqrs }: IProps) => {
  return (
    <div class='space-y-1'>
      {/* Primera fila: resumen arriba y mapa a ancho completo */}
      <SectionCard>
        <div class='space-y-3'>
          <div class='space-y-1'>
            <h3 class='text-xl font-semibold text-t-light dark:text-white'>
              {pqrs.value?.clientName || 'Detalle del caso'}
            </h3>
          </div>
          <div class='flex flex-wrap gap-2'>
            <InfoPill
              icon='📑'
              label='Tipo de Recurso'
              value={pqrs.value?.extraData?.legalResourceType}
            />
            <InfoPill
              icon='🎫'
              label='Ticket'
              value={pqrs.value?.extraData?.referencedTicketNumber}
            />
            <InfoPill
              icon='🛰️'
              label='Servicio Afectado'
              value={pqrs.value?.extraData?.affectedService}
            />
            <InfoPill
              icon='📍'
              label='Municipio'
              value={pqrs.value?.municipality}
            />
            <InfoPill
              icon='🗺️'
              label='Departamento'
              value={pqrs.value?.department}
            />
            <InfoPill
              icon='📡'
              label='Canal de Recepción'
              value={pqrs.value?.extraData?.receptionChannel}
            />
            <InfoPill
              icon='💬'
              label='Sentimiento'
              value={pqrs.value?.extraData?.sentiment}
            />
            {pqrs.value?.transformer && (
              <InfoPill
                icon='🛰️'
                label='Transformador'
                value={pqrs.value?.transformer}
              />
            )}
            {pqrs.value?.pole && (
              <InfoPill icon='🛰️' label='Poste' value={pqrs.value?.pole} />
            )}
            {pqrs.value?.lat && (
              <InfoPill icon='🛰️' label='Latitud' value={pqrs.value?.lat} />
            )}
            {pqrs.value?.lng && (
              <InfoPill icon='🛰️' label='Longitud' value={pqrs.value?.lng} />
            )}
          </div>
        </div>
      </SectionCard>

      {/* Segunda fila: contexto del caso y referencias */}
      <div class='grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-1 items-start'>
        <SectionCard title='Resumen del caso' icon='🧭' className='h-full'>
          <div class='space-y-1'>
            {pqrs.value?.extraData?.mainIssue && (
              <div class='p-3 rounded-xl bg-b-light/80 dark:bg-b-dark border border-gray-border/60 dark:border-b-dark-light'>
                <p class='text-[11px] uppercase tracking-[0.16em] text-gray-text-light dark:text-b-light-dark font-semibold'>
                  Problema Principal
                </p>
                <p class='text-sm text-t-light dark:text-white mt-1 leading-relaxed'>
                  {pqrs.value?.extraData?.mainIssue}
                </p>
              </div>
            )}

            {pqrs.value?.extraData?.userRequest && (
              <div class='p-3 rounded-xl bg-b-light/80 dark:bg-b-dark border border-gray-border/60 dark:border-b-dark-light'>
                <p class='text-[11px] uppercase tracking-[0.16em] text-gray-text-light dark:text-b-light-dark font-semibold'>
                  Solicitud del Usuario
                </p>
                <p class='text-sm text-t-light dark:text-white mt-1 leading-relaxed'>
                  {pqrs.value?.extraData?.userRequest}
                </p>
              </div>
            )}

            {pqrs.value?.extraData?.secondaryIssues &&
              pqrs.value?.extraData?.secondaryIssues.length > 0 && (
                <div class='p-3 rounded-xl bg-yellow-50/80 dark:bg-yellow-950/60 border border-yellow-200 dark:border-yellow-800 shadow-inner'>
                  <div class='flex items-center gap-2 mb-2'>
                    <span class='text-yellow-600 dark:text-yellow-300'>⚠️</span>
                    <p class='text-[11px] uppercase tracking-[0.14em] text-yellow-800 dark:text-yellow-100 font-semibold'>
                      Problemas Secundarios
                    </p>
                  </div>
                  <ul class='list-disc list-inside space-y-1'>
                    {pqrs.value?.extraData?.secondaryIssues.map(
                      (issue, idx) => (
                        <li
                          key={idx}
                          class='text-sm text-yellow-900 dark:text-yellow-100'
                        >
                          {issue}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        </SectionCard>

        <SectionCard
          title='Referencias y periodos'
          icon='🔗'
          className='h-full'
        >
          <div class='space-y-1'>
            {pqrs.value?.extraData?.referencedInvoicePeriods &&
              pqrs.value?.extraData?.referencedInvoicePeriods.length > 0 && (
                <div class='p-3 rounded-xl bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950/60 dark:via-b-dark/50 dark:to-purple-900/50 border border-purple-200 dark:border-purple-800 shadow-sm space-y-2'>
                  <div class='flex items-center justify-between gap-2'>
                    <div class='flex items-center gap-2'>
                      <span class='text-purple-600 dark:text-purple-300'>
                        📅
                      </span>
                      <p class='text-[11px] uppercase tracking-[0.14em] text-purple-800 dark:text-purple-200 font-semibold'>
                        Períodos de Factura
                      </p>
                    </div>
                    <span class='text-[11px] px-2 py-1 rounded-full bg-white/80 dark:bg-purple-900/60 border border-purple-200/70 dark:border-purple-700/60 text-purple-700 dark:text-purple-100'>
                      {pqrs.value?.extraData?.referencedInvoicePeriods.length}{' '}
                      en total
                    </span>
                  </div>

                  <div class='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                    {pqrs.value?.extraData?.referencedInvoicePeriods.map(
                      (period, idx) => (
                        <span
                          key={idx}
                          class='px-3 py-1.5 bg-white/95 dark:bg-purple-950/50 text-purple-800 dark:text-purple-100 text-xs rounded-xl font-mono shadow-sm border border-purple-100/80 dark:border-purple-800/60 text-center truncate'
                          title={period}
                        >
                          {period}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {pqrs.value?.extraData?.referencedTicketNumber && (
              <div class='p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 shadow-inner'>
                <p class='text-[11px] uppercase tracking-[0.14em] text-blue-800 dark:text-blue-200 font-semibold mb-1'>
                  Ticket Referenciado
                </p>
                <p class='text-sm text-blue-900 dark:text-blue-100 font-mono bg-white/70 dark:bg-blue-900/30 px-3 py-2 rounded border border-blue-100 dark:border-blue-800'>
                  {pqrs.value?.extraData?.referencedTicketNumber}
                </p>
              </div>
            )}

            {!pqrs.value?.extraData?.referencedTicketNumber &&
              !(
                pqrs.value?.extraData?.referencedInvoicePeriods &&
                pqrs.value?.extraData?.referencedInvoicePeriods.length > 0
              ) && (
                <div class='p-3 rounded-xl border border-dashed border-gray-border/60 dark:border-b-dark-light text-sm text-gray-text-light dark:text-b-light-dark bg-b-light/40 dark:bg-b-dark/40 text-center'>
                  Sin referencias registradas
                </div>
              )}
          </div>
        </SectionCard>
      </div>

      {/* Datos y archivos */}
      <div class='grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-1 items-start'>
        {(pqrs.value?.raw || pqrs.value?.rawFile || pqrs.value?.resources) && (
          <SectionCard title='Datos y adjuntos' icon='📂'>
            <div class='grid grid-cols-1 lg:grid-cols-3 gap-4 items-start'>
              {pqrs.value?.raw && (
                <div class='lg:col-span-2 space-y-2'>
                  <div class='flex items-center gap-2 text-xs font-semibold text-gray-text-light dark:text-b-light-dark uppercase tracking-[0.12em]'>
                    <span>📄</span>
                    <span>Raw</span>
                  </div>
                  <div class='bg-b-light dark:bg-b-dark rounded-lg p-3 border border-gray-border/60 dark:border-b-dark-light'>
                    <TextEllipsis
                      text={
                        typeof pqrs.value.raw === 'string'
                          ? pqrs.value.raw
                          : JSON.stringify(pqrs.value.raw, null, 2)
                      }
                      maxWidth='100%'
                      lines={10}
                      className='text-xs text-gray-text-light dark:text-b-light-dark font-mono whitespace-pre-wrap'
                    />
                  </div>
                </div>
              )}

              {pqrs.value?.rawFile && (
                <div class='space-y-2'>
                  <div class='flex items-center gap-2 text-xs font-semibold text-gray-text-light dark:text-b-light-dark uppercase tracking-[0.12em]'>
                    <span>📁</span>
                    <span>Raw File</span>
                  </div>
                  <div class='bg-b-light dark:bg-b-dark rounded-lg p-3 border border-gray-border/60 dark:border-b-dark-light'>
                    <TextEllipsis
                      text={
                        typeof pqrs.value.rawFile === 'string'
                          ? pqrs.value.rawFile
                          : JSON.stringify(pqrs.value.rawFile, null, 2)
                      }
                      maxWidth='100%'
                      lines={10}
                      className='text-xs text-gray-text-light dark:text-b-light-dark font-mono whitespace-pre-wrap'
                    />
                  </div>
                </div>
              )}

              {pqrs.value?.resources && (
                <div class='space-y-2 lg:col-span-3'>
                  <div class='flex items-center gap-2 text-xs font-semibold text-gray-text-light dark:text-b-light-dark uppercase tracking-[0.12em]'>
                    <span>📎</span>
                    <span>Archivos Adjuntos</span>
                  </div>
                  <div class='grid gap-3'>
                    <ShowFiles resources={pqrs.value.resources} />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        )}

        <SectionCard title='Mapa' icon='🗺️'>
          <div class='h-[420px] rounded-xl overflow-hidden border border-gray-border/60 dark:border-b-dark-light bg-white dark:bg-b-dark w-full'>
            <MapLibreShowPoints
              name='pqrs-location-map'
              pointsRef={[
                {
                  id: pqrs.value?.id || 0,
                  position: {
                    lat: pqrs.value?.lat || 0,
                    lng: Number(pqrs.value?.lng) || 0,
                  },
                  name: pqrs.value?.clientName || 'Ubicación PQRS',
                },
              ]}
              sendPoints={() => {}}
              center={{
                lat: pqrs.value?.lat || 0,
                lng: Number(pqrs.value?.lng) || 0,
              }}
              height='100%'
              disablePointSelection={true}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default PqrsGeneralModal;
