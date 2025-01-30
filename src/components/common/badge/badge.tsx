import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  color,
  bgColor,
  textColor,
}: IBadgeProps) => {
  return (
    <span
      className={`${color} ${textColor} ${bgColor} text-xs font-bold items-center capitalize pl-1 pr-2 flex justify-between rounded-md py-0.5`}
    >
      <span className={`vx-icon vx-icon-${icon} size-sm mx-1`}></span>
      {label}
    </span>
  );
};
