import { Card } from '@/components/common/card/card';
import { FormattedDate } from '@/components/compose/forms';

import { ICPqrsRequest } from '../utils/interface';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { useCallback } from 'preact/compat';

export interface IProps {
  pqrs: ICPqrsRequest;
  index: number;
  columnColorClass?: string;
  onClick?: (id: number, tags: unknown[], area: any) => void;
}

export const PqrsCards = ({
  pqrs,
  index,
  columnColorClass = 'text-primary',
  onClick,
}: IProps) => {
  const borderColorClass = columnColorClass.replace('text-', 'border-');

  const getBadgeStatus = useCallback(():
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
  }, []);

  const getTags = useCallback(() => {
    const allTags =
      (pqrs as any)?.inferences?.reduce((acc: string[], inf: any) => {
        if (inf.inference?.etiquetas) {
          return [...acc, ...inf.inference.etiquetas];
        }
        return acc;
      }, []) || [];

    return [...new Set(allTags)].slice(0, 3);
  }, []);

  const getArea = useCallback(() => {
    const areaInference = (pqrs as any)?.inferences?.find(
      (inf: any) => inf.inference?.area
    );
    return areaInference?.inference?.area || (pqrs as any)?.area || null;
  }, []);

  const tags = getTags();
  const area = getArea();

  return (
    <Card key={`pqrs-card-${index}`} borderless={false} shadow={true}>
      <div
        class={`p-4 space-y-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-all duration-200 ${borderColorClass}`}
        onClick={() => {
          if (!pqrs.id || !onClick) return;
          onClick(pqrs.id, tags, area);
        }}
      >
        <div class='flex items-center justify-between text-[11px] uppercase tracking-wide'>
          <div class='flex items-center gap-2'>
            <span
              class={`w-2 h-2 rounded-full ${columnColorClass.replace('text-', 'bg-')} shadow-inner`}
            />
            <span class='font-semibold text-t-light'>Estado</span>
            <Badge label={pqrs.status} width='w-24' />
          </div>
          <Badge label={`#${index + 1}`} width='w-12' />
        </div>

        <div class='flex items-start justify-between gap-3'>
          <div class='flex-1 min-w-0'>
            <TextEllipsis
              text={pqrs?.extraData?.clientOrCompanyName || 'Sin nombre'}
              maxWidth='100%'
              lines={1}
              className='font-semibold text-sm leading-tight'
            />
            <div class='flex items-center gap-2 mt-1'>
              {pqrs?.extraData?.ticketNumber && (
                <span class='text-xs font-mono'>
                  #{pqrs?.extraData?.ticketNumber}
                </span>
              )}
              {pqrs?.extraData?.accountNumber && (
                <>
                  <span class=''>•</span>
                  <span class='text-xs'>{pqrs?.extraData?.accountNumber}</span>
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

        {pqrs?.extraData?.registerObservation && (
          <TextEllipsis
            text={pqrs?.extraData?.registerObservation}
            maxWidth='100%'
            lines={2}
            className='text-xs leading-relaxed'
          />
        )}

        {/* Metadata Grid */}
        <div class='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
          {pqrs?.extraData?.filingDate && (
            <div class='flex items-center gap-1.5'>
              <span>📅</span>
              <FormattedDate
                date={String(pqrs?.extraData?.filingDate)}
                format='date'
              />
            </div>
          )}

          {area && (
            <div class='flex items-center gap-1.5 text-gray-text-light'>
              <span>🏢</span>
              <span class='truncate capitalize'>{area.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>

        {(tags.length > 0 ||
          pqrs?.extraData?.hasFiles ||
          typeof pqrs?.extraData?.daysToExpire === 'number') && (
          <div class='flex flex-wrap gap-1.5 pt-2 border-t border-gray-border'>
            {tags.map((tag, idx) => (
              <span
                key={idx}
                class='px-2 py-0.5 bg-b-light text-gray-text-light text-xs rounded'
              >
                #{String(tag)}
              </span>
            ))}

            {pqrs?.extraData?.hasFiles && (
              <span class='px-2 py-0.5 bg-primary-opacity text-primary text-xs rounded flex items-center gap-1'>
                📎 Archivos
              </span>
            )}

            {typeof pqrs?.extraData?.daysToExpire === 'number' &&
              pqrs?.extraData?.daysToExpire <= 3 && (
                <span class='px-2 py-0.5 bg-error-opacity text-error text-xs rounded flex items-center gap-1 font-medium'>
                  ⏰ {pqrs?.extraData?.daysToExpire}d
                </span>
              )}
          </div>
        )}

        <div
          class={`h-1.5 -mx-0.5 -mb-0.5 mt-0 opacity-30 ${columnColorClass.replace('text-', 'bg-')}`}
        />
      </div>
    </Card>
  );
};
