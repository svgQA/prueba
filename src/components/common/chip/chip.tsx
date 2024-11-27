import { FunctionComponent } from 'preact';
import { IChipProps } from './interface';

export const Chip: FunctionComponent<IChipProps> = ({
  label,
  onDelete,
}: IChipProps) => {
  return (
    <div class='relative flex items-center rounded-full border border-slate-300 dark:border-slate-600 py-0.5 px-2.5 text-center text-sm transition-all text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'>
      {label}
      {onDelete && (
        <span
          className='right-3 vox-icon vx-icon-192 cursor-pointer size-sm pl-3'
          onClick={onDelete}
        />
      )}
    </div>
  );
};
