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
    <div>
      <label class='text-xs font-medium text-gray-500'>{t(label)}</label>
      <p class='text-sm text-gray-900'>
        {(typeof value === 'string' ? t(value) : value) || 'N/A'}
      </p>
    </div>
  );
};

const PqrsGeneralModal = ({ pqrs }: IProps) => {
  return (
    <div class='space-y-4'>
      <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {pqrs.value?.extraData?.contractNumber && (
          <TextInformation
            label='Contrato'
            value={pqrs.value?.extraData?.contractNumber}
          />
        )}
        {pqrs.value?.extraData?.associatedPlan && (
          <TextInformation
            label='Plan'
            value={pqrs.value?.extraData?.associatedPlan}
          />
        )}
        {pqrs.value?.extraData?.orderNumber && (
          <TextInformation
            label='Orden'
            value={pqrs.value?.extraData?.orderNumber}
          />
        )}
        {pqrs.value?.extraData?.orderStatus && (
          <TextInformation
            label='Estado Orden'
            value={pqrs.value?.extraData?.orderStatus}
          />
        )}
        <TextInformation
          label='Registrado por'
          value={pqrs.value?.extraData?.registeredBy}
        />
        <TextInformation
          label='Número de Cuenta'
          value={pqrs.value?.extraData?.accountNumber}
        />
        <TextInformation
          label='Ticket'
          value={pqrs.value?.extraData?.ticketNumber}
        />
        <div>
          <label class='text-xs font-medium text-gray-500'>
            Fecha de Registro
          </label>
          <p class='text-sm text-gray-900'>
            {pqrs.value?.extraData?.filingDate ? (
              <FormattedDate
                date={String(pqrs.value?.extraData.filingDate)}
                format='date'
              />
            ) : (
              'N/A'
            )}
          </p>
        </div>
        <div>
          <label class='text-xs font-medium text-gray-500'>
            Fecha Esperada
          </label>
          <p class='text-sm text-gray-900'>
            {pqrs.value?.extraData?.expectedAttentionDate ? (
              <FormattedDate
                date={String(pqrs.value?.extraData.expectedAttentionDate)}
                format='date'
              />
            ) : (
              'N/A'
            )}
          </p>
        </div>
        <TextInformation
          label='Canal de Recepción'
          value={pqrs.value?.extraData?.receptionChannel}
        />
        <TextInformation
          label='Asignado a'
          value={pqrs.value?.extraData?.assignee || 'Sin asignar'}
        />
        {pqrs.value?.extraData?.daysToExpire && (
          <div class='col-span-2'>
            <label class='text-xs font-medium text-gray-500'>
              Días para Expirar
            </label>
            <p
              class={`text-sm font-medium ${pqrs.value?.extraData?.daysToExpire <= 3 ? 'text-red-600' : 'text-gray-900'}`}
            >
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
          <div class='space-y-3'>
            <h4 class='font-semibold text-gray-900 text-sm uppercase tracking-wide border-b pb-1'>
              Archivos Adjuntos
            </h4>
            <div class='grid gap-3'>
              <ShowFiles resources={pqrs.value.resource} />
            </div>
          </div>
        )}
      </div>

      {pqrs.value?.extraData?.referencedTicketNumber && (
        <div class='p-3 bg-blue-50 rounded-lg'>
          <h4 class='font-semibold text-blue-900 text-sm mb-2'>
            🔗 Ticket Referenciado
          </h4>
          <p class='text-sm text-blue-800 font-mono'>
            {pqrs.value?.extraData?.referencedTicketNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default PqrsGeneralModal;
