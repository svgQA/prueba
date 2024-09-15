import './modal.services.css';
import { FunctionComponent } from 'preact/compat';

interface IModalServicesProps {
  label: string;
}

export const ModalServices: FunctionComponent<IModalServicesProps> = ({
  label,
}) => {
  return (
    <button className='navbar-services-button'>
      {label}
      <div className='fixed left-16 bg-transparent w-[85vw] h-[90vh] z-20 invisible p-2 cursor-default'>
        <div className='w-100 h-full bg-white rounded-xl shadow-xl'>
          LA INFORMACION
        </div>
      </div>
    </button>
  );
};
