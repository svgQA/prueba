import { closeOnBoardingModal } from '@/store/signals/modals';
import { useUserStore } from '@/store/slices';
import { OnBoardingStep } from './step';
import { Field, FormSpy } from 'react-final-form';
import {
  employeeCountOptions,
  IOnBoardingStepsProps,
  required,
} from '../utils';

export const OnBoardingSteps = ({ sliderRef }: IOnBoardingStepsProps) => {
  const { setSelected, companies } = useUserStore();
  const setCompanySelected = (company: string) => {
    setSelected(company);
    closeOnBoardingModal();
  };
  return (
    <div
      className='flex transition-transform duration-300 ease-in-out h-full mt-3'
      ref={sliderRef}
    >
      {/* Sacar este primer componente para capturar si ya tiene companies con el fin
    	de evitar seguir sobre el proceso de creaciòn. */}
      <OnBoardingStep title='Companies'>
        <div className='w-full'>
          <h4 className='font-semibold text-3xl'>Tryvoo:</h4>
          {companies.map((company) => (
            <div
              key={`selector-company-${company.name}`}
              name={company.id}
              className='w-full border-2 my-1 cursor-pointer hover:bg-gray-100 py-2 rounded-md flex flex-row justify-between px-4 items-center'
              onClick={() => setCompanySelected(company.id)}
            >
              <div className='flex flex-row'>
                <h4 className='w-96'>{company.name}</h4>
                <span className='bg-teal-500 text-white px-2 py-1 rounded-full text-sm'>
                  {company.role}
                </span>
              </div>
              <span className='vx-icon vx-users' />
            </div>
          ))}
        </div>
      </OnBoardingStep>
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
                <option value='1' default>
                  Tecnología
                </option>
                <option value='2'>Salud</option>
                <option value='3'>Alimentación y bebidas</option>
                <option value='4'>Construcción e inmobiliaria</option>
                <option value='5'>Educación</option>
                <option value='6'>Finanzas</option>
                <option value='7'>Transporte y logística</option>
                <option value='8'>Turismo y Hospitalidad</option>
                <option value='9'>Energía y recursos naturales</option>
                <option value='10'>Otra</option>
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
                <option value='1' default>
                  Consultoria
                </option>
                <option value='2'>Desarrollo de Software</option>
                <option value='3'>Diseño UX/UI</option>
                <option value='4'>Marketing DIgital</option>
                <option value='5'>Soporte Técnico</option>
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
};
