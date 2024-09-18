// PriceCard.tsx
import { FunctionComponent } from 'preact/compat';

interface PriceCardProps {
  title: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  semiannualPrice?: number;
}

export const PriceCard: FunctionComponent<PriceCardProps> = ({
  title,
  description,
  monthlyPrice,
  annualPrice,
  semiannualPrice,
}) => {
  return (
    <div className='bg-with h-[38em] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105'>
      <div className='p-8 bg-gray'>
        <h3 className='text-4xl font-bold mb-4 text-gray-800'>{title}</h3>
        <p className='text-gray-600 mb-6 text-left'>{description}</p>
        <div className='space-y-10'>
          <div className='flex justify-between items-center border-t pt-4'>
            <span className='text-gray-600'>Mensual</span>
            <span className='text-2xl font-bold text-gray-800'>
              ${monthlyPrice} COP /mes
            </span>
          </div>
          <div className='flex justify-between items-center border-t pt-4'>
            <span className='text-gray-600'>Anual</span>
            <span className='text-2xl font-bold text-gray-800'>
              ${annualPrice} COP /año
            </span>
          </div>
          {semiannualPrice && (
            <div className='flex justify-between items-center border-t pt-4'>
              <span className='text-gray-600'>Semestral</span>
              <span className='text-2xl font-bold text-gray-800'>
                ${semiannualPrice} COP /semestre
              </span>
            </div>
          )}
        </div>
      </div>
      <div className='bg-gray-50 p-4'>
        <button className='w-full my-[25%] bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300'>
          Seleccionar Plan
        </button>
      </div>
    </div>
  );
};
