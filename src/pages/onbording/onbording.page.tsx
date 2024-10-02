import './onboarding.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { IOnboardingProps } from './interface';
import { DEFAULT_STEP, employeeCountOptions, STEPS } from './constants';
import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';
import { Form, Field, FormSpy } from 'react-final-form';
import { required } from './validate';

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

interface IOnBoardingStepsProps {
  sliderRef: any;
  values: any;
}

const OnBoardingSteps = ({ sliderRef }: IOnBoardingStepsProps) => (
  <div
    className='flex transition-transform duration-300 ease-in-out h-full mt-3'
    ref={sliderRef}
  >
    <OnBoardingStep title='Voxline'></OnBoardingStep>
    <OnBoardingStep title='Información del administrador'>
      <Field<string> name='admin_name' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <input
              {...input}
              placeholder='Nombre del administrador'
              name='ob-input-admin-name'
              type='text'
              tabIndex={-1}
            />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
      <Field<string> name='admin_phone' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <input
              {...input}
              placeholder='Teléfono'
              name='ob-input-admin-phone'
              type='tel'
              tabIndex={-1}
            />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
      <Field<string> name='admin_address' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <input
              {...input}
              placeholder='Address'
              name='ob-input-admin-address'
              type='text'
              tabIndex={-1}
            />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
    </OnBoardingStep>
    <OnBoardingStep title='Información de la empresa'>
      <Field<string> name='company_name' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <input
              {...input}
              placeholder='Nombre de la compañía'
              name='ob-input-company-name'
              type='text'
              tabIndex={-1}
            />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
      <Field<string> name='company_nit' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <input
              {...input}
              placeholder='NIT de la Empresa'
              name='ob-input-company-nit'
              type='tel'
              tabIndex={-1}
            />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
      <Field<string> name='company_address' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <input
              {...input}
              placeholder='Location'
              name='ob-input-admin-address'
              type='text'
              tabIndex={-1}
            />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
    </OnBoardingStep>
    <OnBoardingStep title='Rubro de la empresa y Servicios de interés'>
      <Field<string> name='company_industry' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <select
              {...input}
              placeholder='Company Industry'
              name='ob-select-company-industry'
              type='text'
              tabIndex={-1}
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
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
      <Field<string> name='company_interest' validate={required}>
        {({ input, meta }) => (
          <div className='onboarding-inputs'>
            <select
              {...input}
              placeholder='Company Interest'
              name='ob-select-company-interest'
              type='text'
              tabIndex={-1}
            >
              <option value='Consultoria'>Consultoria</option>
              <option value='Desarrollo de Software'>
                Desarrollo de Software
              </option>
              <option value='Diseño UX/UI'>Diseño UX/UI</option>
              <option value='Marketing DIgital'>Marketing DIgital</option>
              <option value='Soporte Técnico'>Soporte Técnico</option>
            </select>
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
    </OnBoardingStep>
    <OnBoardingStep title='Número de empleados'>
      <div className='flex flex-wrap gap-2 justify-center'>
        {employeeCountOptions.map((option) => (
          <Field
            key={`number-employees-${option}`}
            name='employee_company'
            type='radio'
            value={option}
          >
            {({ input }) => (
              <label
                className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                  input.checked
                    ? 'bg-[#00BDD6] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <input
                  {...input}
                  type='radio'
                  className='hidden'
                  tabIndex={-1}
                />
                {option}
              </label>
            )}
          </Field>
        ))}
      </div>
    </OnBoardingStep>
    <OnBoardingStep title='Resumen de la información'>
      <FormSpy subscription={{ values: true }}>
        {({ values }) => <pre>{JSON.stringify(values, null, 2)}</pre>}
      </FormSpy>
    </OnBoardingStep>
  </div>
);

export const OnBordingPage = ({ onSubmit, closed }: IOnboardingProps) => {
  const [step, setStep] = useState<number>(DEFAULT_STEP);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, STEPS));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${(step - 1) * 100}%)`;
    }
  }, [step]);

  return closed ? null : (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-95'>
      <Form
        onSubmit={onSubmit}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit, values }) => (
          <form
            className='bg-white rounded-sm shadow-lg w-[80vw] overflow-hidden relative pt-10'
            onSubmit={handleSubmit}
          >
            <span
              className={`top-0 right-0 absolute p-4 text-sm text-[#A5ACBA] mb-2 ${step > 1 ? 'visibe' : 'invisible'}`}
            >
              Paso {step - 1} de {STEPS}
            </span>
            <OnBoardingSteps values={values} sliderRef={sliderRef} />
            <div className='py-2 bg-gray-100 flex justify-evenly'>
              <button
                className={`onboarding-buttons bg-[#A5ACBA] ${step > 1 ? 'visible' : 'invisible'}`}
                type='button'
                onClick={handlePrev}
              >
                Anterior
              </button>
              <button
                className={`onboarding-buttons bg-[#00BDD6] ${step === STEPS ? 'invisible' : 'visible'}`}
                type='button'
                onClick={handleNext}
              >
                Siguiente
              </button>
              <button
                className={`onboarding-buttons bg-[#00BDD6] ${step === STEPS ? 'visible' : 'invisible'}`}
                type='submit'
              >
                Finalizar
              </button>
            </div>
          </form>
        )}
      ></Form>
    </div>
  );
};
