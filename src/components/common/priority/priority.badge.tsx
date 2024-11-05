import { FunctionComponent } from 'preact';
import { PriorityBadgeProps } from './interface';

export const Badge: FunctionComponent<PriorityBadgeProps> = ({ priority }) => {
  const bgColor =
    priority === 'Alta'
      ? 'rgb(224,88,88)'
      : priority === 'Media'
        ? 'rgb(255,128,0)'
        : 'rgb(0,189,214)';

  return (
    <div
      className='flex items-center justify-center py-1 rounded text-white text-sm w-[90px]'
      style={{ backgroundColor: bgColor }}
    >
      <span className='vx-icon mx-1 vx-siren size-sm'></span>
      <span>{priority}</span>
    </div>
  );
};
