import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  color,
  bgColor,
}: IBadgeProps) => {
  return (
    <span
      className={`${color} ${bgColor} text-xs font-extralight items-center capitalize pl-1 pr-2 flex justify-between rounded-md`}
    >
      <span className={`vx-icon mx-1 vx-${icon} size-sm`}></span>
      {label}
    </span>
  );
};
