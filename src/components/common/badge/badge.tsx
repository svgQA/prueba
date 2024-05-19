import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  color,
}: IBadgeProps) => {
  return (
    <span
      className={`text-${color}-800 text-2xs font-extralight items-center capitalize pl-1 pr-2 flex justify-between rounded-md bg-${color}-200`}
    >
      <span className={`vx-icon mx-1 vx-${icon} size-sm`}></span>
      {label}
    </span>
  );
};
