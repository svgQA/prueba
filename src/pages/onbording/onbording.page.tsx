import './onboarding.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { IOnboardingModel, IOnboardingProps } from './interface';
import {
  DEFAULT_STEP,
  INIT_ONBOARDING_MODEL_STATE,
  employeeCountOptions,
  STEPS,
} from './constants';

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

  const handleEmployeeCountSelect = (count: string) => {
    setFormData((prev) => ({ ...prev, employeeCount: count }));
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
        <div className='flex-1'>
          <h2 className='text-lg font-bold mb-4 text-[#1D2128]'>
            Número de empleados
          </h2>
          <div className='grid grid-cols-3 gap-2'>
            {employeeCountOptions.map((option) => (
              <span
                key={option}
                onClick={() => handleEmployeeCountSelect(option)}
                className={`flex items-center justify-center w-full py-2 px-3 rounded-[100px] text-base cursor-pointer border ${
                  formData.employeeCount === option
                    ? 'bg-[#00BDD6] text-white border-[#00BDD6]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } outline-none focus:outline-none active:outline-none`}
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className='onboarding-slide'>
        <div className='scroll-bar flex-1 overflow-y-auto'>
          <h2 className='text-lg font-bold mb-8 text-[#1D2128]'>
            Resumen de la información
          </h2>
          <div className='grid grid-cols-3 gap-8'>
            <div>
              <h3>Información del administrador:</h3>
              <p>
                <strong>Nombre:</strong> {formData.adminName}
              </p>
              <p>
                <strong>Teléfono:</strong> {formData.adminPhone}
              </p>
              <p>
                <strong>Dirección: </strong>
                {formData.adminAddress}
              </p>
            </div>
            <div>
              <h3>Información de la empresa:</h3>
              <p>
                <strong>Nombre:</strong> {formData.companyName}
              </p>
              <p>
                <strong>NIT:</strong> {formData.companyNIT}
              </p>
              <p>
                <strong>Ubicación:</strong> {formData.companyLocation}
              </p>
            </div>
            <div>
              <h3>Rubro de la empresa:</h3>
              <p>
                <strong>{formData.companyIndustry}</strong>
              </p>
            </div>
            <div>
              <h3>Servicios de interés:</h3>
              <p>
                <strong>{formData.serviceOfInterest}</strong>
              </p>
            </div>
            <div>
              <h3>Número de empleados:</h3>
              <p>
                <strong>{formData.employeeCount}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg w-[55vw] overflow-hidden relative pt-10'>
        <span
          className={`top-0 right-0 absolute p-4 text-sm text-[#A5ACBA] mb-2 ${step > 1 ? 'visibe' : 'invisible'}`}
        >
          Paso {step - 1} de {STEPS}
        </span>
        {renderSteps()}
        <div className='flex justify-evenly pb-5'>
          <button
            className={`bg-[#A5ACBA] text-white py-2 px-4 rounded ${step > 1 ? 'visible' : 'invisible'} focus:outline-none active:bg-[#A5ACBA]`}
            onClick={handlePrev}
          >
            Anterior
          </button>
          <button
            className='bg-[#00BDD6] text-white py-2 px-4 rounded focus:outline-none active:bg-[#00BDD6]'
            onClick={step === STEPS ? () => onFinished(formData) : handleNext}
          >
            {step === STEPS ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};
