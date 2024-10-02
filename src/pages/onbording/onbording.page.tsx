import './onboarding.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { IOnboardingProps } from './interface';
import { DEFAULT_STEP, employeeCountOptions, STEPS } from './constants';
import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';
import { onBoardingModel, onBoardingState } from '@/store/signals/modals';

interface IOnBoardingStepProps extends PropsWithChildren {
  title?: string;
}

const OnBoardingStep: FunctionComponent<IOnBoardingStepProps> = ({
  children,
  title,
}) => {
  return (
    <div className='onboarding-slide'>
      <h2 className='text-lg font-bold text-[#1D2128]'>{title}</h2>
      <div className='flex-1 flex flex-col justify-center items-center'>
        {children}
      </div>
    </div>
  );
};

export const OnBordingPage = ({ onFinished, closed }: IOnboardingProps) => {
  const [step, setStep] = useState<number>(DEFAULT_STEP);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name in onBoardingState.value) {
      (onBoardingState.value as any)[name] = value;
    }
  };

  const handleEmployeeCountSelect = (count: string) => {
    onBoardingState.value.employeeCount = count;
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
      <OnBoardingStep title='Voxline'></OnBoardingStep>
      <OnBoardingStep title='Información del administrador'>
        <input
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='adminName'
          value={onBoardingState.value.adminName}
          onChange={handleInputChange}
          placeholder='Nombre del administrador'
        />
        <input
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='adminPhone'
          value={onBoardingState.value.adminPhone}
          onChange={handleInputChange}
          placeholder='Teléfono'
        />
        <input
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='adminAddress'
          value={onBoardingState.value.adminAddress}
          onChange={handleInputChange}
          placeholder='Dirección'
        />
      </OnBoardingStep>
      <OnBoardingStep title='Información de la empresa'>
        <input
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='companyName'
          value={onBoardingState.value.companyName}
          onChange={handleInputChange}
          placeholder='Nombre de la compañía'
        />
        <input
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='companyNIT'
          value={onBoardingState.value.companyNIT}
          onChange={handleInputChange}
          placeholder='NIT de la empresa'
        />
        <input
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='companyLocation'
          value={onBoardingState.value.companyLocation}
          onChange={handleInputChange}
          placeholder='Ubicación'
        />
      </OnBoardingStep>
      <OnBoardingStep title='Rubro de la empresa y Servicios de interés'>
        <select
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='companyIndustry'
          value={onBoardingState.value.companyIndustry}
          onChange={handleInputChange}
        >
          <option value=''>Selecciona un rubro...</option>
          <option value='Tecnología'>Tecnología</option>
          <option value='Salud'>Salud</option>
          <option value='Alimentación y bebidas'>Alimentación y bebidas</option>
          <option value='Construcción e inmobiliaria'>
            Construcción e inmobiliaria
          </option>
          <option value='Educación'>Educación</option>
          <option value='Finanzas'>Finanzas</option>
          <option value='Transporte y logística'>Transporte y logística</option>
          <option value='Turismo y Hospitalidad'>Turismo y Hospitalidad</option>
          <option value='Energía y recursos naturales'>
            Energía y recursos naturales
          </option>
          <option value='Otra'>Otra</option>
        </select>
        <select
          className='w-full p-2 mb-4 border border-gray-300 rounded'
          name='serviceOfInterest'
          value={onBoardingState.value.serviceOfInterest}
          onChange={handleInputChange}
        >
          <option value=''>Selecciona un servicio de interés...</option>
          <option value='Consultoria'>Consultoria</option>
          <option value='Desarrollo de Software'>Desarrollo de Software</option>
          <option value='Diseño UX/UI'>Diseño UX/UI</option>
          <option value='Marketing DIgital'>Marketing DIgital</option>
          <option value='Soporte Técnico'>Soporte Técnico</option>
        </select>
      </OnBoardingStep>
      <OnBoardingStep title='Número de empleados'>
        <div className='grid grid-cols-3 gap-2'>
          {employeeCountOptions.map((option) => (
            <span
              key={option}
              onClick={() => handleEmployeeCountSelect(option)}
              className={`flex items-center justify-center w-full py-2 px-3 rounded-[100px] text-base cursor-pointer border ${
                onBoardingState.value.employeeCount === option
                  ? 'bg-[#00BDD6] text-white border-[#00BDD6]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } outline-none focus:outline-none active:outline-none`}
            >
              {option}
            </span>
          ))}
        </div>
      </OnBoardingStep>
      <OnBoardingStep title='Resumen de la información'>
        <div className='grid grid-cols-3 gap-8'>
          <div>
            <h3>Información del administrador:</h3>
            <p>
              <strong>Nombre:</strong> {onBoardingState.value.adminName}
            </p>
            <p>
              <strong>Teléfono:</strong> {onBoardingState.value.adminPhone}
            </p>
            <p>
              <strong>Dirección: </strong>
              {onBoardingState.value.adminAddress}
            </p>
          </div>
          <div>
            <h3>Información de la empresa:</h3>
            <p>
              <strong>Nombre:</strong> {onBoardingState.value.companyName}
            </p>
            <p>
              <strong>NIT:</strong> {onBoardingState.value.companyNIT}
            </p>
            <p>
              <strong>Ubicación:</strong>{' '}
              {onBoardingState.value.companyLocation}
            </p>
          </div>
          <div>
            <h3>Rubro de la empresa:</h3>
            <p>
              <strong>{onBoardingState.value.companyIndustry}</strong>
            </p>
          </div>
          <div>
            <h3>Servicios de interés:</h3>
            <p>
              <strong>{onBoardingState.value.serviceOfInterest}</strong>
            </p>
          </div>
          <div>
            <h3>Número de empleados:</h3>
            <p>
              <strong>{onBoardingState.value.employeeCount}</strong>
            </p>
          </div>
        </div>
      </OnBoardingStep>
    </div>
  );

  return closed ? null : (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-95'>
      <div className='bg-white rounded-sm shadow-lg w-[80vw] overflow-hidden relative pt-10'>
        <span
          className={`top-0 right-0 absolute p-4 text-sm text-[#A5ACBA] mb-2 ${step > 1 ? 'visibe' : 'invisible'}`}
        >
          Paso {step - 1} de {STEPS}
        </span>
        {renderSteps()}
        <div className='py-2 bg-gray-100 flex justify-evenly'>
          <button
            className={`bg-[#A5ACBA] text-white py-2 px-4 rounded ${step > 1 ? 'visible' : 'invisible'} focus:outline-none active:bg-[#A5ACBA]`}
            onClick={handlePrev}
          >
            Anterior
          </button>
          <button
            className='bg-[#00BDD6] text-white py-2 px-4 rounded focus:outline-none active:bg-[#00BDD6]'
            onClick={
              step === STEPS
                ? () => onFinished(onBoardingModel.value)
                : handleNext
            }
          >
            {step === STEPS ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};
