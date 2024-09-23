import './modal.services.css';
import { FunctionComponent, useState } from 'preact/compat';
import { VerticalMenu } from './modal.vertical.menu';
import { menuItems, MenuItem } from './modal.menu.items';
import { LogoGrid } from './modal.logo.grid'; // Esta
import { clientLogos, allyLogos } from './modal.constant.logo'; // Esta

interface IModalServicesProps {
  label: string;
}

export const ModalServices: FunctionComponent<IModalServicesProps> = ({
  label,
}) => {
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);

  const handleItemChange = (item: MenuItem | null) => {
    setCurrentItem(item);
  };

  return (
    <button
      className='navbar-services-button'
      aria-haspopup='true'
      aria-expanded='false'
    >
      {label}
      <div
        className='fixed left-16 bg-transparent w-[93vw] h-[90vh] z-20 invisible p-2 cursor-default'
        role='dialog'
        aria-label='Servicios'
      >
        <div className='w-full h-full bg-white rounded-xl shadow-xl will-change-transform flex'>
          <VerticalMenu items={menuItems} onItemChange={handleItemChange} />
          <div className='flex-1 p-6 overflow-auto'>
            <h2 className='text-4xl font-bold mb-4 text-black'>
              {currentItem ? currentItem.label : 'Nuestros Servicios'}
            </h2>
            {/* Renderización de Aliados, puse */}
            {currentItem?.id === 'aliados' && (
              <LogoGrid logos={allyLogos} title='Nuestros Aliados' />
            )}
            {/* Renderización de Aliados, puse */}
            {currentItem?.id === 'clientes' && (
              <LogoGrid logos={clientLogos} title='Nuestros Clientes' />
            )}
            {/* Renderización del texto sino se cumple alguna de las condiciones, puse */}
            {currentItem?.id !== 'aliados' &&
              currentItem?.id !== 'clientes' && (
                <p className='text-black'>
                  {currentItem
                    ? currentItem.description
                    : 'Pon el cursos sobre el item del menú para ver mas detalle'}
                </p>
              )}

            {/* <p className='text-black'> Version anterior
              {currentItem
                ? currentItem.description
                : 'Pasa el cursor sobre un ítem del menú para ver más detalles.'}
            </p> */}
          </div>
        </div>
      </div>
    </button>
  );
};
