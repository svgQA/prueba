import { FunctionComponent, useState } from 'preact/compat';
import { Link } from 'wouter';

interface ModalServicesProps {
  to: string;
  label: string;
}
export const ModalServices: FunctionComponent<ModalServicesProps> = ({
  to,
  label,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className='relative'
      onMouseEnter={() => setIsModalOpen(true)}
      onMouseLeave={() => setIsModalOpen(false)}
    >
      <Link to={to} className='z-50 relative'>
        {label}
      </Link>
      {/* <button className="px-4 py-2 text-white">
        Services
      </button> */}

      {isModalOpen && (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] h-[85%] bg-white shadow-lg rounded-lg overflow-auto z-50 text-black'>
          <div className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>Servicios</h2>
            <p>
              Este es el contenido del modal que aparece al pasar el mouse sobre
              el botón Services.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
