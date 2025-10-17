import './modal.services.css';
import { FunctionComponent, useState, useRef, useEffect } from 'preact/compat';
import { VerticalMenu } from './modal.vertical.menu';
import { menuItems, MenuItem } from './modal.menu.items';
import { LogoGrid } from './modal.logo.grid';
import { clientLogos, allyLogos } from './modal.generate.logo';
import { PriceCard } from './modal.price.card';
import { plans } from './modal.price.data';

interface IModalServicesProps {
  label: string;
}

export const ModalServices: FunctionComponent<IModalServicesProps> = ({
  label,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleItemChange = (item: MenuItem | null) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative'>
      <button
        className='navbar-services-button'
        aria-haspopup='true'
        aria-expanded={isModalOpen}
        onMouseEnter={() => setIsModalOpen(true)}
      >
        {label}
      </button>
      <div
        ref={modalRef}
        className={`${
          isModalOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } fixed left-16 top-16 bg-white w-[93vw] h-[90vh] z-20 p-2 rounded-xl shadow-xl transition-opacity duration-300`}
        role='dialog'
        aria-label='Servicios'
      >
        <div className='w-full h-full flex'>
          <VerticalMenu items={menuItems} onItemChange={handleItemChange} />
          <div className='flex-1 p-6 flex flex-col overflow-hidden'>
            <h2 className='text-4xl font-bold mb-4 text-black'>
              {currentItem ? currentItem.label : 'Nuestros Servicios'}
            </h2>
            <div className='flex-grow overflow-hidden'>
              <div
                className={`h-full ${currentItem?.id === 'aliados' ? 'block' : 'hidden'}`}
              >
                <LogoGrid logos={allyLogos} title='Nuestros Aliados' />
              </div>
              <div
                className={`h-full ${currentItem?.id === 'clientes' ? 'block' : 'hidden'}`}
              >
                <LogoGrid logos={clientLogos} title='Nuestros Clientes' />
              </div>
              <div
                className={`h-full overflow-auto ${currentItem?.id === 'planes-y-precios' ? 'block' : 'hidden'}`}
              >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {plans.map((plan) => (
                    <PriceCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </div>
              <div
                className={`h-full ${currentItem && !['aliados', 'clientes', 'planes-y-precios'].includes(currentItem.id) ? 'block' : 'hidden'}`}
              >
                <p className='text-black'>
                  {currentItem
                    ? currentItem.description
                    : 'Selecciona un ítem del menú para ver más detalles'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
