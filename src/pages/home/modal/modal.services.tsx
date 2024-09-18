// ModalServices.tsx

import './modal.services.css';
import { FunctionComponent } from 'preact/compat';
import { VerticalMenu } from './vertical.menu';
import { menuItems } from './menu.items';

interface IModalServicesProps {
  label: string;
}

export const ModalServices: FunctionComponent<IModalServicesProps> = ({
  label,
}) => {
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
          <VerticalMenu items={menuItems} />
          <div className='flex-1 p-6 overflow-auto'>
            <h2 className='text-2xl font-bold mb-4 text-black'>
              Contenido Principal
            </h2>
            <p className='text-black'>
              Selecciona una opción del menú para ver más detalles.
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};

// import './modal.services.css';
// import { FunctionComponent } from 'preact/compat';

// interface IModalServicesProps {
//   label: string;
// }

// export const ModalServices: FunctionComponent<IModalServicesProps> = ({
//   label,
// }) => {
//   return (
//     <button className='navbar-services-button'>
//       {label}
//       <div className='fixed left-16 bg-transparent w-[93vw] h-[90vh] z-20 invisible p-2 cursor-default'>
//         <div className='w-100 h-full bg-white rounded-xl shadow-xl'>
//           <p className='text-black'>Servicios Listado</p>
//         </div>
//       </div>
//     </button>
//   );
// };
