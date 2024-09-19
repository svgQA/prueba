import './onboarding.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { IOnboardingModel, IOnboardingProps } from './interface';
import { DEFAULT_STEP, INIT_ONBOARDING_MODEL_STATE, STEPS } from './constants';

export const Onbording = ({ onFinished }: IOnboardingProps) => {
  const [step, setStep] = useState<number>(DEFAULT_STEP);
  const [formData, setFormData] = useState<IOnboardingModel>(
    INIT_ONBOARDING_MODEL_STATE
  );
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, STEPS));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${(step - 1) * 100}%)`;
    }
  }, [step]);

  const renderSteps = () => (
    <div
      className='flex transition-transform duration-300 ease-in-out h-full'
      ref={sliderRef}
    >
      <div className='onboarding-slide'>
        <div className='flex-1 flex flex-col justify-center items-center'>
          <h1 className='text-2xl font-bold mb-8 text-[#1D2128]'>Voxline</h1>
        </div>
      </div>
      <div className='onboarding-slide'>
        <div className='flex-1'>
          <h2 className='text-lg font-bold mb-4 text-[#1D2128]'>
            Información del administrador
          </h2>
          <input
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='adminName'
            value={formData.adminName}
            onChange={handleInputChange}
            placeholder='Nombre del administrador'
          />
          <input
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='adminPhone'
            value={formData.adminPhone}
            onChange={handleInputChange}
            placeholder='Teléfono'
          />
          <input
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='adminAddress'
            value={formData.adminAddress}
            onChange={handleInputChange}
            placeholder='Dirección'
          />
        </div>
      </div>
      <div className='onboarding-slide'>
        <div className='flex-1'>
          <h2 className='text-lg font-bold mb-4 text-[#1D2128]'>
            Información de la empresa
          </h2>
          <input
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='companyName'
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder='Nombre de la compañía'
          />
          <input
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='companyNIT'
            value={formData.companyNIT}
            onChange={handleInputChange}
            placeholder='NIT de la empresa'
          />
          <input
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='companyLocation'
            value={formData.companyLocation}
            onChange={handleInputChange}
            placeholder='Ubicación'
          />
        </div>
      </div>
      <div className='onboarding-slide'>
        <div className='flex-1 overflow-y-auto'>
          <h2 className='text-lg font-bold mb-4 text-[#1D2128]'>
            Rubro de la empresa y Servicios de interés
          </h2>
          <select
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='companyIndustry'
            value={formData.companyIndustry}
            onChange={handleInputChange}
          >
            <option value=''>Selecciona un rubro...</option>
            <option value='Tecnología'>Tecnología</option>
            <option value='Salud'>Salud</option>
            <option value='Alimentación y bebidas'>
              Alimentación y bebidas
            </option>
            <option value='Construcción e inmobiliaria'>
              Construcción e inmobiliaria
            </option>
            <option value='Educación'>Educación</option>
            <option value='Finanzas'>Finanzas</option>
            <option value='Transporte y logística'>
              Transporte y logística
            </option>
            <option value='Turismo y Hospitalidad'>
              Turismo y Hospitalidad
            </option>
            <option value='Energía y recursos naturales'>
              Energía y recursos naturales
            </option>
            <option value='Otra'>Otra</option>
          </select>
          <select
            className='w-full p-2 mb-4 border border-gray-300 rounded'
            name='serviceOfInterest'
            value={formData.serviceOfInterest}
            onChange={handleInputChange}
          >
            <option value=''>Selecciona un servicio de interés...</option>
            <option value='Consultoria'>Consultoria</option>
            <option value='Desarrollo de Software'>
              Desarrollo de Software
            </option>
            <option value='Diseño UX/UI'>Diseño UX/UI</option>
            <option value='Marketing DIgital'>Marketing DIgital</option>
            <option value='Soporte Técnico'>Soporte Técnico</option>
          </select>
        </div>
      </div>
      <div className='onboarding-slide'>
        <div className='flex-1 overflow-y-auto'>
          <h2 className='text-lg font-bold mb-4 text-[#1D2128]'>
            Número de empleados
          </h2>
          <input
            className='w-full mb-4'
            type='range'
            name='employeeCount'
            value={formData.employeeCount}
            onChange={handleInputChange}
            min='0'
            max='1000'
          />
          <p>Número de empleados: {formData.employeeCount}</p>
        </div>
      </div>
      <div className='onboarding-slide'>FINAL</div>
    </div>
  );

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg w-96 overflow-hidden relative pt-10'>
        <span
          className={`top-0 right-0 absolute p-4 text-sm text-[#A5ACBA] mb-2 ${step > 1 ? 'visibe' : 'invisible'}`}
        >
          Step {step - 1} de {STEPS}
        </span>
        {renderSteps()}
        <div className='flex justify-evenly pb-5'>
          <button
            className={`bg-[#A5ACBA] text-white py-2 px-4 rounded ${step > 1 ? 'visible' : 'invisible'}`}
            onClick={handlePrev}
          >
            Anterior
          </button>
          <button
            className='bg-[#00BDD6] text-white py-2 px-4 rounded'
            onClick={step === STEPS ? () => onFinished(formData) : handleNext}
          >
            {step === STEPS ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};
