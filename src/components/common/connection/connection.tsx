import { FunctionComponent, memo } from 'preact/compat';
import { ConnectionBadgeProps } from './interface';

const connectionColors = {
  Conectado: 'bg-green-500',
  Inactivo: 'bg-red-500',
  Nunca: 'bg-gray-500',
  default: 'bg-cyan-500',
};

export const PBadge2: FunctionComponent<ConnectionBadgeProps> = memo(
  ({ connection }) => {
    const bgColorClass =
      connectionColors[connection] || connectionColors.default;

    return (
      <div
        className={`flex items-center justify-center py-1 rounded text-sm w-[90px] ${bgColorClass}`}
      >
        <span className='vx-icon mx-1 vx-siren size-sm'></span>
        <span>{connection}</span>
      </div>
    );
  }
);
