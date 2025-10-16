import { useRef, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ComponentType } from 'preact';
import { TooltipPublicProps } from '../../types/public-types';
import { BarTask } from '../../types/bar-task';
import styles from './tooltip.module.css';
import { Gauge } from '@/components/common/gauge/gauge';
import { Badge } from '@/components/common/badge/badge';
import { useTranslation } from 'react-i18next';

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: ComponentType<TooltipPublicProps>;
};

export const Tooltip = ({
  task,
  rowHeight,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const relatedY = useSignal(0);
  const relatedX = useSignal(0);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            task.x1 +
            taskListWidth -
            arrowIndent * 1.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      relatedY.value = newRelatedY;
      relatedX.value = newRelatedX;
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    scrollX,
    scrollY,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return (
    <div
      ref={tooltipRef}
      className={
        relatedX.value
          ? styles.tooltipDetailsContainer
          : styles.tooltipDetailsContainerHidden
      }
      style={{ left: relatedX.value, top: relatedY.value - 70 }}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent = ({
  task,
  fontSize,
  fontFamily,
}: TooltipPublicProps) => {
  const style = {
    fontSize,
    fontFamily,
  };
  const { t } = useTranslation();

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return date;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const startDate = new Date(task.start);
  const endDate = new Date(task.end);
  const range = endDate.getTime() - startDate.getTime();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'CREATED':
        return 'info';
      case 'OPENED':
        return 'success';
      case 'RESOLVED':
        return 'warning';
      case 'CLOSED':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div
      className='bg-white dark:bg-b-dark-dark rounded-lg shadow-lg p-2 max-w-3xl border-2 border-gray-200 dark:border-gray-700 z-10'
      style={style}
    >
      <div className='flex'>
        <div className='w-[70%]'>
          <h3 className='font-bold text-lg text-gray-900 dark:text-gray-200 mb-4 max-w-72 line-clamp-2 break-words'>
            [{task.id}] {task.name}
          </h3>

          <div className='space-y-4 text-sm text-gray-600 dark:text-gray-300'>
            <div className='flex gap-4'>
              <div>
                <p className='font-medium'>{t('h_date_start')}</p>
                <p>{formatDate(task.start)}</p>
              </div>

              <div>
                <p className='font-medium'>{t('h_date_end')}</p>
                <p>{formatDate(task.end)}</p>
              </div>
            </div>

            <div>
              <Badge
                label={task.status}
                status={getStatusColor(task.status)}
                full
                outline
                size='xs'
              />
            </div>
          </div>
        </div>

        <div className='w-[30%] flex items-center justify-around flex-col'>
          {range !== 0 && (
            <div>
              <p className='font-medium text-gray-700 dark:text-gray-200'>
                {t('h_duration')}
              </p>
              <p className='text-gray-600 dark:text-gray-300'>
                {~~(range / (1000 * 60 * 60))} hours
              </p>
            </div>
          )}
          <Gauge progress={task.progress} color='red' />
        </div>
      </div>
    </div>
  );
};
