import { FunctionComponent } from 'preact';
import { IChipProps, sizeMap } from './interface.d';

export const Chip: FunctionComponent<IChipProps> = ({
  label,
  onDelete,
  width = 'full',
  icon,
}: IChipProps) => {
  return (
    <div
      class={`relative justify-between flex items-center rounded-full border border-slate-300 dark:border-slate-600 py-1 px-3 text-center text-sm transition-all text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 ${sizeMap[width]}`}
    >
      <span class='truncate'>{label}</span>
      {icon && <span className={`vox-icon vx-icon-${icon} size-sm`}></span>}
      {onDelete && (
        <span
          className='right-3 vox-icon vx-icon-192 cursor-pointer size-sm pl-3 flex-shrink-0'
          onClick={onDelete}
        />
      )}
    </div>
  );
};
