// Componente donde se renderizarán los logos,
// si quiero dos aliados, pongo dos veces el componente Logo
import { FunctionComponent } from 'preact/compat';
import { LogoItem } from './modal.constant.logo';
import { Logo } from './modal.logo';

interface LogoGridProps {
  logos: LogoItem[];
  title: string;
}

export const LogoGrid: FunctionComponent<LogoGridProps> = ({
  logos,
  title,
}) => {
  return (
    <div>
      <h3 className='text-2xl font-bold mb-6 text-gray-800'>{title}</h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {logos.map((logo) => (
          <Logo key={logo.id} logo={logo} />
        ))}
      </div>
    </div>
  );
};
