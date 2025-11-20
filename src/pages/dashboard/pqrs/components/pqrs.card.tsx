import { useSignal } from '@preact/signals';

import { Card } from '@/components/common/card/card';
import { Badge } from '@/components/common/badge/badge';
import { Chip } from '@/components/common/chip/chip';
import { FormattedDate } from '@/components/compose/forms';

import { ICPqrsRequest } from '../utils/interface';
import { PqrsModal } from './pqrs.modal';

export interface IProps {
  pqrs: ICPqrsRequest;
  index: number;
}

export const PqrsCards = ({ pqrs, index }: IProps) => {
  const openModal = useSignal<boolean>(false);
  const modalId = useSignal<number | undefined>();

  const getPriorityVariant = (type?: string | null) => {
    const variants: Record<string, string> = {
      petition: 'info',
      complaint: 'warning',
      claim: 'danger',
      suggestion: 'success',
    };
    return variants[(type || '').toLowerCase()] || 'default';
  };

  return (
    <>
      <div
        key={`pqrs-card-${index}`}
        class='cursor-pointer hover:shadow-lg transition-shadow duration-200'
      >
        <Card color='mb-3 p-4 border border-gray-200 rounded-lg bg-white'>
          <div class='space-y-3' onClick={() => {
            openModal.value = true
            modalId.value = pqrs.id
          }}>
            <div class='flex justify-between items-start'>
              <div class='flex-1'>
                <h4 class='font-medium text-gray-900 text-sm leading-tight'>
                  {pqrs.extraData.clientOrCompanyName || 'Sin nombre'}
                </h4>
                <p class='text-xs text-gray-500 mt-1'>
                  {pqrs.extraData.accountNumber
                    ? `#${pqrs.extraData.accountNumber}`
                    : ''}
                </p>
              </div>
              {pqrs.extraData.requestType && (
                <Badge label={getPriorityVariant(pqrs.extraData.requestType)} />
              )}
            </div>
            {pqrs.extraData.registerObservation && (
              <p class='text-sm text-gray-600 line-clamp-2'>
                {pqrs.extraData.registerObservation}
              </p>
            )}
            <div class='flex flex-wrap gap-2'>
              {pqrs.extraData.filingDate && (
                <FormattedDate
                  date={String(pqrs.extraData.filingDate)}
                  format='date'
                />
              )}
              {pqrs.extraData.hasFiles && <Chip label='📎 Archivos' />}
              {typeof pqrs.extraData.daysToExpire === 'number' &&
                pqrs.extraData.daysToExpire <= 3 && (
                  <Chip label={`⏰ ${pqrs.extraData.daysToExpire} días`} />
                )}
            </div>
            <div class='flex justify-between items-center text-xs text-gray-500'>
              <span>{pqrs.extraData.registeredBy || 'Sin asignar'}</span>
              {pqrs.extraData.ticketNumber && (
                <span class='font-mono'>#{pqrs.extraData.ticketNumber}</span>
              )}
            </div>
          </div>
        </Card>
        <PqrsModal
          id={modalId.value}
          showModal={openModal}
          closeModal={() => (openModal.value = false)}
        />
      </div>
    </>
  );
};
