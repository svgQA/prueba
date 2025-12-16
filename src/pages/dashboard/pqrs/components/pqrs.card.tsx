import { Card } from '@/components/common/card/card';
import { FormattedDate } from '@/components/compose/forms';

import { ICPqrsRequest } from '../utils/interface';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { useCallback } from 'preact/compat';
import { Button } from '@/components/common/button/button';
import { PqrsAiService } from '@/services/pqrs/ai-pqrs';
import dayjs from 'dayjs';

export interface IProps {
  pqrs: ICPqrsRequest;
  index: number;
  columnColorClass?: string;
  onClick?: (id: number, tags: unknown[], area: any) => void;
  onRetry?: (id: number) => void;
  onContinue?: (id: number) => void;
}

export const PqrsCards = ({
  pqrs,
  index,
  columnColorClass = 'text-primary',
  onClick,
}: IProps) => {
  const accentBgClass = columnColorClass.replace('text-', 'bg-');
  const accentBorderClass = columnColorClass.replace('text-', 'border-');

  const getBadgeStatus = useCallback(():
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'ternary' => {
    const pqrsType = pqrs?.extraData?.pqrsType?.toLowerCase();
    if (pqrsType === 'queja') return 'error';
    if (pqrsType === 'sugerencia') return 'success';
    if (pqrsType === 'reclamo') return 'warning';
    if (pqrsType === 'recurso') return 'ternary';
    return 'info';
  }, [pqrs?.extraData?.pqrsType]);

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

  const onExecuteButtonByStage = async (
    id: number,
    type: 'RETRY' | 'CONTINUE'
  ) => {
    const stageId =
      type === 'RETRY'
        ? pqrs.inferences[pqrs.inferences.length - 1]?.stage?.prevStageId
        : pqrs.inferences[pqrs.inferences.length - 1]?.stage?.nextStageId;
    await PqrsAiService.execute_ai_process_again(id, { stageId: Number(stageId) });
  };

  const calculateDaysToExpire = useCallback(() => {
    if (!pqrs?.startDate) return null;

    const startDate = dayjs(pqrs.startDate);
    const expirationDate = startDate.add(15, 'days');
    const today = dayjs();

    const daysRemaining = expirationDate.diff(today, 'days');

    return {
      daysRemaining,
      isExpired: daysRemaining < 0,
      isExpiringSoon: daysRemaining >= 0 && daysRemaining <= 3,
    };
  }, [pqrs?.startDate]);

  const tags = getTags();
  const area = getArea();
  const expirationStatus = calculateDaysToExpire();
  const pqrsButtonByStage =
    pqrs.status?.toLowerCase() === 'error' ||
    pqrs.inferences[pqrs.inferences.length - 1]?.stage?.type === 'MANUAL';

  return (
    <Card key={`pqrs-card-${index}`} borderless shadow={false}>
      {/*
          hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] 
  */}
      <div
        class={`relative p-4 space-y-4 cursor-pointer transition-all duration-200 rounded-xl border border-gray-border/60 dark:border-gray-border/30 bg-white/95 dark:bg-b-dark-light/95 
          ${accentBorderClass}`}
        onClick={() => {
          if (!pqrs.id || !onClick) return;
          onClick(pqrs.id, tags, area);
        }}
      >
        <div class='absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary/12 via-secondary/10 to-ternary/12 dark:from-primary/18 dark:via-secondary/15 dark:to-ternary/18' />

        <div class='flex items-center justify-between text-[11px] uppercase tracking-wide text-gray-text-light dark:text-t-dark'>
          <div class='flex items-center gap-2'>
            <span
              class={`w-2 h-2 rounded-full ${accentBgClass} shadow-inner`}
            />
            <span class='font-semibold text-t-light dark:text-t-dark-light'>
              Estado
            </span>
            <Badge
              label={pqrs.status}
              width='w-fit'
              outline
              status='info'
              size='xs'
            />
          </div>
          <Badge label={`#${index + 1}`} width='w-fit' outline size='xs' />
        </div>

        <div class='flex items-start justify-between gap-3'>
          <div class='flex-1 min-w-0 space-y-1.5'>
            <TextEllipsis
              text={pqrs?.extraData?.title || pqrs?.clientName || 'Sin nombre'}
              maxWidth='100%'
              lines={1}
              className='font-semibold text-sm leading-tight text-t-light dark:text-t-dark-light'
            />
            <div class='flex items-center flex-wrap gap-2 text-[11px] text-gray-text-light dark:text-t-dark'>
              {pqrs?.identifier && (
                <span class='font-mono px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark'>
                  #{pqrs?.identifier}
                </span>
              )}
              {pqrs?.contract && (
                <span class='px-2 py-0.5 rounded-full bg-primary-opacity text-primary'>
                  {pqrs?.contract}
                </span>
              )}
              {area && area.name && (
                <span class='px-2 py-0.5 rounded-full bg-b-light text-gray-text-light dark:bg-b-dark'>
                  {area.name}
                </span>
              )}
            </div>
          </div>

          {pqrs?.extraData?.pqrsType && (
            <div class='flex flex-col gap-1.5 items-end'>
              <Badge
                label={pqrs?.extraData?.pqrsType}
                status={getBadgeStatus()}
                outline
                width='w-fit'
              />
            </div>
          )}
        </div>

        {pqrs?.extraData?.observation && (
          <TextEllipsis
            text={pqrs?.extraData?.observation}
            maxWidth='100%'
            lines={2}
            className='text-xs leading-relaxed text-gray-text-light dark:text-t-dark'
          />
        )}

        {/* Metadata Grid */}
        <div class='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-text-light dark:text-t-dark'>
          {pqrs?.startDate && (
            <div class='flex items-center gap-1.5'>
              <span>📅</span>
              <FormattedDate date={String(pqrs?.startDate)} format='date' />
            </div>
          )}

          {pqrs?.contactEmail && (
            <div class='flex items-center gap-1.5'>
              <span>📧</span>
              <TextEllipsis
                text={pqrs.contactEmail}
                maxWidth='100%'
                lines={1}
              />
            </div>
          )}
        </div>

        {(tags.length > 0 || pqrs?.resources || expirationStatus) && (
          <div class='flex flex-wrap gap-1.5 pt-2 border-t border-gray-border/60 dark:border-gray-border/30'>
            {tags.map((tag, idx) => (
              <span
                key={idx}
                class='px-2 py-0.5 bg-b-light text-gray-text-light text-xs rounded-full dark:bg-b-dark'
              >
                #{String(tag)}
              </span>
            ))}

            {pqrs?.resources && (
              <span class='px-2 py-0.5 bg-primary-opacity text-primary text-xs rounded-full flex items-center gap-1'>
                📎 Archivos
              </span>
            )}

            {expirationStatus?.isExpired && (
              <span class='px-2 py-0.5 bg-error-opacity text-error text-xs rounded-full flex items-center gap-1 font-medium'>
                ⏰ Expirado hace {Math.abs(expirationStatus.daysRemaining)}d
              </span>
            )}

            {expirationStatus?.isExpiringSoon &&
              !expirationStatus?.isExpired && (
                <span class='px-2 py-0.5 bg-caution-opacity text-caution text-xs rounded-full flex items-center gap-1 font-medium'>
                  ⏰ Expira en {expirationStatus.daysRemaining}d
                </span>
              )}
          </div>
        )}

        {/* Actions Stage */}
        {pqrsButtonByStage && (
          <div class='flex gap-2 pt-1'>
            <Button
              name='retry-button'
              label='h_retry'
              onClick={(e: Event) => {
                e.stopPropagation();
                if (pqrs.id) onExecuteButtonByStage(pqrs.id, 'RETRY');
              }}
              className='flex-1 py-1.5 text-xs bg-primary/12 text-primary rounded-lg hover:bg-primary/20 transition-colors'
              icon='refresh'
            />
            <Button
              name='continue-button'
              label='h_continue'
              onClick={(e: Event) => {
                e.stopPropagation();
                if (pqrs.id) onExecuteButtonByStage(pqrs.id, 'CONTINUE');
              }}
              className='flex-1 py-1.5 text-xs bg-secondary/12 text-secondary rounded-lg hover:bg-secondary/20 transition-colors'
              icon='arrow-right'
            />
          </div>
        )}

        <div class={`h-1 rounded-full opacity-25 ${accentBgClass}`} />
      </div>
    </Card>
  );
};
