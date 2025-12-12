import { Signal } from '@preact/signals';

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

const TextInformation = ({ label, value }: ITextInformationProps) => {
  const { t } = useTranslation();

  return (
    <div class='p-3 rounded-lg bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light shadow-sm'>
      <label class='text-[11px] font-semibold text-gray-500 dark:text-b-light-dark tracking-wide uppercase'>
        {t(label)}
      </label>
      <p class='text-sm text-t-light dark:text-white mt-1'>
        {(typeof value === 'string' ? t(value) : value) || 'N/A'}
      </p>
    </div>
  );
};

const PqrsGeneralModal = ({ pqrs }: IProps) => {
  return (
    <div class='space-y-4'>
      <div class='grid grid-cols-1 lg:grid-cols-5 gap-4'>
        <div class='lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div class='md:col-span-1 bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light rounded-lg p-3 shadow-sm'>
            <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide border-b border-gray-border dark:border-b-dark-light pb-2 mb-3'>
              📍 Ubicación
            </h4>
            <div class='space-y-3'>
              {pqrs.value?.municipality && (
                <TextInformation label='Municipio' value={pqrs.value?.municipality} />
              )}
              {pqrs.value?.department && (
                <TextInformation label='Departamento' value={pqrs.value?.department} />
              )}
              {pqrs.value?.transformer && (
                <TextInformation label='Transformador' value={pqrs.value?.transformer} />
              )}
              {pqrs.value?.pole && (
                <TextInformation label='Poste' value={pqrs.value?.pole} />
              )}
              {pqrs.value?.lat && (
                <TextInformation label='Latitud' value={pqrs.value?.lat} />
              )}
              {pqrs.value?.lng && (
                <TextInformation label='Longitud' value={pqrs.value?.lng} />
              )}
            </div>
          </div>

          <div class='md:col-span-3 bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light rounded-lg p-3 shadow-sm'>
            <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide border-b border-gray-border dark:border-b-dark-light pb-2 mb-3'>
              📍 Mapa
            </h4>
            <div class='h-[400px] rounded-lg overflow-hidden'>
              <MapLibreShowPoints
                name='pqrs-location-map'
                pointsRef={[
                  {
                    id: pqrs.value?.id || 0,
                    position: {
                      lat: pqrs.value?.lat || 0,
                      lng: pqrs.value?.lng || '',
                    },
                    name: pqrs.value?.clientName || 'Ubicación PQRS',
                  },
                ]}
                sendPoints={() => { }}
                center={{ lat: pqrs.value?.lat || 0, lng: pqrs.value?.lng || 0 }}
                height='100%'
                disablePointSelection={true}
              />
            </div>
          </div>
        </div>

        <div class='lg:col-span-2 space-y-4'>
          {pqrs.value?.raw && (
            <div class='bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light rounded-lg p-3 shadow-sm'>
              <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide border-b border-gray-border dark:border-b-dark-light pb-2 mb-3'>
                📄 Raw
              </h4>
              <div class='bg-gray-50 dark:bg-b-dark-light rounded p-3'>
                <TextEllipsis
                  text={typeof pqrs.value.raw === 'string' ? pqrs.value.raw : JSON.stringify(pqrs.value.raw, null, 2)}
                  maxWidth='100%'
                  lines={8}
                  className='text-xs text-gray-text-light dark:text-b-light-dark font-mono whitespace-pre-wrap'
                />
              </div>
            </div>
          )}

          {pqrs.value?.rawFile && (
            <div class='bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light rounded-lg p-3 shadow-sm'>
              <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide border-b border-gray-border dark:border-b-dark-light pb-2 mb-3'>
                📁 Raw File
              </h4>
              <div class='bg-gray-50 dark:bg-b-dark-light rounded p-3'>
                <TextEllipsis
                  text={typeof pqrs.value.rawFile === 'string' ? pqrs.value.rawFile : JSON.stringify(pqrs.value.rawFile, null, 2)}
                  maxWidth='100%'
                  lines={8}
                  className='text-xs text-gray-text-light dark:text-b-light-dark font-mono whitespace-pre-wrap'
                />
              </div>
            </div>
          )}

          {pqrs.value?.resources && (
            <div class='bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light rounded-lg p-3 shadow-sm'>
              <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide border-b border-gray-border dark:border-b-dark-light pb-2 mb-3'>
                📎 Archivos Adjuntos
              </h4>
              <div class='grid gap-3'>
                <ShowFiles resources={pqrs.value.resources} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {pqrs.value?.extraData?.legalResourceType && (
          <TextInformation
            label='Tipo de Recurso Legal'
            value={pqrs.value?.extraData?.legalResourceType}
          />
        )}
        {pqrs.value?.extraData?.mainIssue && (
          <div class='col-span-2 p-3 rounded-lg bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light shadow-sm'>
            <label class='text-[11px] font-semibold text-gray-500 dark:text-b-light-dark tracking-wide uppercase'>
              Problema Principal
            </label>
            <p class='text-sm text-t-light dark:text-white mt-1'>
              {pqrs.value?.extraData?.mainIssue}
            </p>
          </div>
        )}
        {pqrs.value?.extraData?.affectedService && (
          <TextInformation
            label='Servicio Afectado'
            value={pqrs.value?.extraData?.affectedService}
          />
        )}
        {pqrs.value?.extraData?.receptionChannel && (
          <TextInformation
            label='Canal de Recepción'
            value={pqrs.value?.extraData?.receptionChannel}
          />
        )}
        {pqrs.value?.extraData?.userRequest && (
          <div class='col-span-2 p-3 rounded-lg bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light shadow-sm'>
            <label class='text-[11px] font-semibold text-gray-500 dark:text-b-light-dark tracking-wide uppercase'>
              Solicitud del Usuario
            </label>
            <p class='text-sm text-t-light dark:text-white mt-1'>
              {pqrs.value?.extraData?.userRequest}
            </p>
          </div>
        )}

        {pqrs.value?.extraData?.sentiment && (
          <TextInformation
            label='Sentimiento'
            value={pqrs.value?.extraData?.sentiment}
          />
        )}
      </div>

      {pqrs.value?.extraData?.secondaryIssues &&
        pqrs.value?.extraData?.secondaryIssues.length > 0 && (
          <div class='p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-900 shadow-sm'>
            <div class='flex items-center gap-2 mb-2'>
              <span class='text-yellow-600 dark:text-yellow-300'>⚠️</span>
              <h4 class='font-semibold text-yellow-900 dark:text-yellow-200 text-sm'>
                Problemas Secundarios
              </h4>
            </div>
            <ul class='list-disc list-inside space-y-1'>
              {pqrs.value?.extraData?.secondaryIssues.map((issue, idx) => (
                <li
                  key={idx}
                  class='text-sm text-yellow-800 dark:text-yellow-100'
                >
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

      {pqrs.value?.extraData?.referencedInvoicePeriods &&
        pqrs.value?.extraData?.referencedInvoicePeriods.length > 0 && (
          <div class='p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-900 shadow-sm'>
            <div class='flex items-center gap-2 mb-2'>
              <span class='text-purple-600 dark:text-purple-300'>📅</span>
              <h4 class='font-semibold text-purple-900 dark:text-purple-200 text-sm'>
                Períodos de Factura Referenciados
              </h4>
            </div>
            <div class='flex flex-wrap gap-2'>
              {pqrs.value?.extraData?.referencedInvoicePeriods.map(
                (period, idx) => (
                  <span
                    key={idx}
                    class='px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-xs rounded font-mono'
                  >
                    {period}
                  </span>
                )
              )}
            </div>
          </div>
        )}

      {pqrs.value?.extraData?.referencedTicketNumber && (
        <div class='p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900 shadow-sm'>
          <div class='flex items-center gap-2 mb-2'>
            <span class='text-blue-600 dark:text-blue-300'>🔗</span>
            <h4 class='font-semibold text-blue-900 dark:text-blue-200 text-sm'>
              Ticket Referenciado
            </h4>
          </div>
          <p class='text-sm text-blue-800 dark:text-blue-100 font-mono bg-white/60 dark:bg-blue-900/30 px-3 py-2 rounded'>
            {pqrs.value?.extraData?.referencedTicketNumber}
          </p>
        </div>
      )}

    </div>
  );
};

export default PqrsGeneralModal;
