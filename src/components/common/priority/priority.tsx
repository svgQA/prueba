import { FunctionComponent, memo } from 'preact/compat';
import { PriorityBadgeProps } from './interface';

const priorityColors = {
  Alta: 'bg-red-500',
  Media: 'bg-orange-500',
  Baja: 'bg-cyan-500',
  default: 'bg-cyan-500',
};

export const PBadge: FunctionComponent<PriorityBadgeProps> = memo(
  ({ priority }) => {
    const bgColorClass = priorityColors[priority] || priorityColors.default;

    return (
      <div
        className={`flex items-center justify-center py-1 rounded text-sm w-[90px] ${bgColorClass}`}
      >
        <span className='vx-icon mx-1 vx-siren size-sm'></span>
        <span>{priority}</span>
      </div>
    );
  }
);
