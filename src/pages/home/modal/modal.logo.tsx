// Componente Logo Individual por si se requiere
import { FunctionComponent } from 'preact/compat';
import { LogoItem } from './modal.constant.logo';

interface LogoProps {
  logo: LogoItem;
}

export const Logo: FunctionComponent<LogoProps> = ({ logo }) => {
  return (
    <div className='flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      <img
        src={logo.imageUrl}
        alt={`Logo de ${logo.name}`}
        className='max-w-full max-h-16 object-contain'
      />
    </div>
  );
};
