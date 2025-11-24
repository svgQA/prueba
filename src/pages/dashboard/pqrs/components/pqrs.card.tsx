import { useSignal } from '@preact/signals';

import { Card } from '@/components/common/card/card';
import { FormattedDate } from '@/components/compose/forms';

import { ICPqrsRequest } from '../utils/interface';
import { PqrsModal } from './pqrs.modal';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';

export interface IProps {
  pqrs: ICPqrsRequest;
  index: number;
  columnColorClass?: string;
}

export const PqrsCards = ({
  pqrs,
  index,
  columnColorClass = 'text-primary',
}: IProps) => {
  const openModal = useSignal<boolean>(false);
  const modalId = useSignal<number | undefined>();
  const borderColorClass = columnColorClass.replace('text-', 'border-');

  const getBadgeStatus = ():
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'ternary' => {
    if (columnColorClass.includes('error')) return 'error';
    if (
      columnColorClass.includes('secondary') ||
      columnColorClass.includes('m6')
    )
      return 'success';
    if (columnColorClass.includes('caution')) return 'warning';
    if (columnColorClass.includes('ternary')) return 'ternary';
    return 'info';
  };

  const getTags = () => {
    const allTags =
      (pqrs as any)?.inferences?.reduce((acc: string[], inf: any) => {
        if (inf.inference?.etiquetas) {
          return [...acc, ...inf.inference.etiquetas];
        }
        return acc;
      }, []) || [];

    return [...new Set(allTags)].slice(0, 3);
  };

  const getArea = () => {
    const areaInference = (pqrs as any)?.inferences?.find(
      (inf: any) => inf.inference?.area
    );
    return areaInference?.inference?.area || (pqrs as any)?.area || null;
  };

  const tags = getTags();
  const area = getArea();

  return (
    <>
      <Card key={`pqrs-card-${index}`} borderless={false} shadow={true}>
        <div
          class={`p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${borderColorClass}`}
          onClick={() => {
            openModal.value = true;
            modalId.value = pqrs.id;
          }}
        >
          <div class='flex items-start justify-between gap-3'>
            <div class='flex-1 min-w-0'>
              <TextEllipsis
                text={pqrs.extraData.clientOrCompanyName || 'Sin nombre'}
                maxWidth='100%'
                lines={1}
                className='font-semibold text-t-light text-sm leading-tight'
              />
              <div class='flex items-center gap-2 mt-1'>
                {pqrs.extraData.ticketNumber && (
                  <span class='text-xs text-gray-text-light font-mono'>
                    #{pqrs.extraData.ticketNumber}
                  </span>
                )}
                {pqrs.extraData.accountNumber && (
                  <>
                    <span class='text-b-light-dark'>•</span>
                    <span class='text-xs text-gray-text-light'>
                      {pqrs.extraData.accountNumber}
                    </span>
                  </>
                )}
              </div>
            </div>

            {pqrs?.extraData?.requestType && (
              <div class='flex flex-col gap-1.5 items-end'>
                <Badge
                  label={pqrs?.extraData?.requestType}
                  status={getBadgeStatus()}
                  full
                  outline
                />
              </div>
            )}
          </div>

          {pqrs.extraData.registerObservation && (
            <TextEllipsis
              text={pqrs.extraData.registerObservation}
              maxWidth='100%'
              lines={2}
              className='text-xs text-gray-text-light leading-relaxed'
            />
          )}

          {/* Metadata Grid */}
          <div class='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
            {pqrs.extraData.filingDate && (
              <div class='flex items-center gap-1.5 text-gray-text-light'>
                <span>📅</span>
                <FormattedDate
                  date={String(pqrs.extraData.filingDate)}
                  format='date'
                />
              </div>
            )}

            {area && (
              <div class='flex items-center gap-1.5 text-gray-text-light'>
                <span>🏢</span>
                <span class='truncate capitalize'>
                  {area.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>

          {(tags.length > 0 ||
            pqrs.extraData.hasFiles ||
            typeof pqrs.extraData.daysToExpire === 'number') && (
            <div class='flex flex-wrap gap-1.5 pt-2 border-t border-gray-border'>
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  class='px-2 py-0.5 bg-b-light text-gray-text-light text-xs rounded'
                >
                  #{String(tag)}
                </span>
              ))}

              {pqrs.extraData.hasFiles && (
                <span class='px-2 py-0.5 bg-primary-opacity text-primary text-xs rounded flex items-center gap-1'>
                  📎 Archivos
                </span>
              )}

              {typeof pqrs.extraData.daysToExpire === 'number' &&
                pqrs.extraData.daysToExpire <= 3 && (
                  <span class='px-2 py-0.5 bg-error-opacity text-error text-xs rounded flex items-center gap-1 font-medium'>
                    ⏰ {pqrs.extraData.daysToExpire}d
                  </span>
                )}
            </div>
          )}

          <div
            class={`h-1.5 -mx-0.5 -mb-0.5 mt-0 opacity-30 ${columnColorClass.replace('text-', 'bg-')}`}
          />
        </div>

        <PqrsModal
          id={modalId.value}
          showModal={openModal}
          closeModal={() => (openModal.value = false)}
          tags={tags}
          areas={area}
        />
      </Card>
    </>
  );
};
