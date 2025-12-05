import { Signal } from '@preact/signals';

import { useTranslation } from 'react-i18next';

import { FormattedDate } from '@/components/compose/forms';
import ShowFiles from '@/components/common/file/show.file';

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
      <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {pqrs.value?.extraData?.contractNumber && pqrs.value?.extraData?.contractNumber !== "N/A" && (
          <TextInformation
            label='Contrato'
            value={pqrs.value?.extraData?.contractNumber}
          />
        )}
        {pqrs.value?.extraData?.associatedPlan && pqrs.value?.extraData?.associatedPlan !== "N/A" && (
          <TextInformation
            label='Plan'
            value={pqrs.value?.extraData?.associatedPlan}
          />
        )}
        {pqrs.value?.extraData?.orderNumber && pqrs.value?.extraData?.orderNumber !== "N/A" && (
          <TextInformation
            label='Orden'
            value={pqrs.value?.extraData?.orderNumber}
          />
        )}
        {pqrs.value?.extraData?.orderStatus && pqrs.value?.extraData?.orderStatus !== "N/A" && (
          <TextInformation
            label='Estado Orden'
            value={pqrs.value?.extraData?.orderStatus}
          />
        )}
        {pqrs.value?.extraData?.registeredBy && pqrs.value?.extraData?.registeredBy !== "N/A" && (
          <TextInformation
            label='Registrado por'
            value={pqrs.value?.extraData?.registeredBy}
          />
        )}
        {pqrs.value?.extraData?.accountNumber && pqrs.value?.extraData?.accountNumber !== "N/A" && (
          <TextInformation
            label='Número de Cuenta'
            value={pqrs.value?.extraData?.accountNumber}
          />
        )}
        {pqrs.value?.extraData?.ticketNumber && pqrs.value?.extraData?.ticketNumber !== "N/A" && (
          <TextInformation
            label='Ticket'
            value={pqrs.value?.extraData?.ticketNumber}
          />
        )}
        {pqrs.value?.extraData?.filingDate && pqrs.value?.extraData?.filingDate !== "N/A" && (
          <div>
            <label class='text-[11px] font-semibold text-gray-500 dark:text-b-light-dark tracking-wide uppercase'>
              Fecha de Registro
            </label>
            <p class='text-sm text-t-light dark:text-white mt-1'>
              <FormattedDate
                date={String(pqrs.value?.extraData.filingDate)}
                format='date'
              />
            </p>
          </div>
        )}
        {pqrs.value?.extraData?.expectedAttentionDate && pqrs.value?.extraData?.expectedAttentionDate !== "N/A" && (
          <div>
            <label class='text-[11px] font-semibold text-gray-500 dark:text-b-light-dark tracking-wide uppercase'>
              Fecha Esperada
            </label>
            <p class='text-sm text-t-light dark:text-white mt-1'>
              <FormattedDate
                date={String(pqrs.value?.extraData.expectedAttentionDate)}
                format='date'
              />
            </p>
          </div>
        )}
        {pqrs.value?.extraData?.receptionChannel && pqrs.value?.extraData?.receptionChannel !== "N/A" && (
          <TextInformation
            label='Canal de Recepción'
            value={pqrs.value?.extraData?.receptionChannel}
          />
        )}
        {pqrs.value?.extraData?.assignee && pqrs.value?.extraData?.assignee !== "N/A" && (
          <TextInformation
            label='Asignado a'
            value={pqrs.value?.extraData?.assignee}
          />
        )}
        {pqrs.value?.extraData?.daysToExpire && (
          <div class='col-span-2 p-3 rounded-lg bg-gradient-to-r from-primary-opacity to-secondary-opacity border border-primary/30'>
            <label class='text-[11px] font-semibold text-primary uppercase tracking-wide'>
              Días para Expirar
            </label>
            <p class='text-sm font-semibold text-primary mt-1'>
              {pqrs.value?.extraData?.daysToExpire} días
            </p>
          </div>
        )}
        {/* {(pqrs.value?.extraData.hasFiles && pqrs.value?.extraData.informationFile) && (
                    <TextInformation
                        label='Analisis del archivo'
                        value={pqrs.value?.extraData.informationFile}
                    />
                )} */}
        {pqrs.value?.resource && (
          <div class='space-y-3 bg-white dark:bg-b-dark border border-gray-border dark:border-b-dark-light rounded-lg p-3 shadow-sm'>
            <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide border-b border-gray-border dark:border-b-dark-light pb-1'>
              Archivos Adjuntos
            </h4>
            <div class='grid gap-3'>
              <ShowFiles resources={pqrs.value.resource} />
            </div>
          </div>
        )}
      </div>

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
