// import { FunctionComponent, useState, useRef, useEffect } from 'preact/compat';
// import { Link } from 'wouter';

// interface ModalServicesProps {
//   to: string;
//   label: string;
// }

// export const ModalServices: FunctionComponent<ModalServicesProps> = ({ to, label }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const linkRef = useRef<HTMLAnchorElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
//           linkRef.current && !linkRef.current.contains(event.target as Node)) {
//         setIsModalOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="relative">
//       <Link to={to} className='z-40 relative' ref={linkRef} onMouseEnter={() => setIsModalOpen(true)}>
//         {label}
//       </Link>

//       {isModalOpen && (
//         <div
//           ref={modalRef}
//           className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] h-[85%] bg-white shadow-lg rounded-lg overflow-auto z-40 text-black"
//         >
//           <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Servicios</h2>
//             <p>Este es el contenido del modal que aparece al pasar el mouse sobre el botón Services.</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

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
