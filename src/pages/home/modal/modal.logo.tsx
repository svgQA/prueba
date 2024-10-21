import { FunctionComponent } from 'preact/compat';
import { LogoItem } from './modal.generate.logo';

interface LogoProps {
  logo: LogoItem;
}

export const Logo: FunctionComponent<LogoProps> = ({ logo }) => {
  return (
    <div className='flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300'>
      <img
        src={logo.url}
        alt={`Logo de ${logo.name}`}
        className='max-w-full max-h-16 object-contain'
      />
    </div>
  );
};
