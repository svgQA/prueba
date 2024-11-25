import { FunctionComponent } from 'preact';
import { IChipProps } from './interface';

export const Chip: FunctionComponent<IChipProps> = ({
  label,
  onDelete,
}: IChipProps) => {
  return (
    <div class='flex items-center rounded-full border border-slate-300 py-0.5 px-2.5 text-center text-sm transition-all shadow-sm text-slate-600'>
      {label}
      {onDelete && (
        <button
          class='flex items-center justify-center transition-all p-0.5 rounded-md text-white hover:bg-white/10 active:bg-white/10 ml-1 scale-75'
          type='button'
          onClick={onDelete}
        >
          <span className='vox-icon vx-icon-192' />
        </button>
      )}
    </div>
  );
};
