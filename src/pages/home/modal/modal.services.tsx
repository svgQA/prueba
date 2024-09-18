import './modal.services.css';
import { FunctionComponent, useState } from 'preact/compat';
import { VerticalMenu } from './modal.vertical.menu';
import { menuItems, MenuItem } from './modal.menu.items';

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
            <p className='text-black'>
              {currentItem
                ? currentItem.description
                : 'Pasa el cursor sobre un ítem del menú para ver más detalles.'}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};
