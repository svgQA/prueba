import { Field, FormSpy } from 'react-final-form';
import {
  employeeCountOptions,
  industryOptions,
  interestOptions,
  IOnBoardingStepsProps,
  required,
} from '../utils';
import { Input, Select } from '@/components/common';
import { OnBoardingStep } from './step';

export const OnBoardingSteps = ({
  sliderRef,
  children,
}: IOnBoardingStepsProps) => {
  const handleTabKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const currentStep = (e.target as HTMLElement).closest('.onboarding-step');
      if (currentStep) {
        const focusableElements = currentStep.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0] as HTMLElement;
        const lastFocusableElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === lastFocusableElement
        ) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
  };

  return (
    <div
      className='flex transition-transform duration-300 ease-in-out h-full mt-3'
      ref={sliderRef}
      onKeyDown={handleTabKeyPress}
    >
      {/* Sacar este primer componente para capturar si ya tiene companies con el fin
     de evitar seguir sobre el proceso de creaciòn. */}
      <OnBoardingStep title='Companies'>
        <div className='w-full flex flex-row flex-wrap gap-3 justify-evenly'>
          {children}
        </div>
      </OnBoardingStep>
      <OnBoardingStep title='Información del administrador'>
        <Field<string> name='admin_name' validate={required}>
          {({ input, meta }) => (
            <Input
              {...input}
              placeholder='Nombre del administrador'
              label='Nombre del administrador'
              name='ob-input-admin-name'
              type='text'
              meta={meta}
              icon='203'
            />
          )}
        </Field>
        <Field<string> name='admin_phone' validate={required}>
          {({ input, meta }) => (
            <Input
              {...input}
              placeholder='Teléfono'
              label='Teléfono'
              name='ob-input-admin-phone'
              type='tel'
              meta={meta}
              icon='204'
            />
          )}
        </Field>
        <Field<string> name='admin_address' validate={required}>
          {({ input, meta }) => (
            <Input
              {...input}
              placeholder='Address'
              label='Address'
              name='ob-input-admin-address'
              type='text'
              meta={meta}
              icon='205'
            />
          )}
        </Field>
      </OnBoardingStep>
      <OnBoardingStep title='Información de la empresa'>
        <Field<string> name='company_name' validate={required}>
          {({ input, meta }) => (
            <Input
              {...input}
              placeholder='Nombre de la compañía'
              label='Nombre de la compañía'
              name='ob-input-company-name'
              type='text'
              meta={meta}
              icon='206'
            />
          )}
        </Field>
        <Field<string> name='company_nit' validate={required}>
          {({ input, meta }) => (
            <Input
              {...input}
              placeholder='NIT de la Empresa'
              label='NIT de la Empresa'
              name='ob-input-company-nit'
              type='tel'
              meta={meta}
              icon='207'
            />
          )}
        </Field>
        <Field<string> name='company_address' validate={required}>
          {({ input, meta }) => (
            <Input
              {...input}
              placeholder='Location'
              label='Location'
              name='ob-input-admin-address'
              type='text'
              meta={meta}
              icon='208'
            />
          )}
        </Field>
      </OnBoardingStep>
      <OnBoardingStep title='Rubro de la empresa y Servicios de interés'>
        <Field<string> name='company_industry' validate={required}>
          {({ input, meta }) => (
            <Select
              {...input}
              placeholder='Company Industry'
              label='Company Industry'
              name='ob-select-company-industry'
              id='ob-select-company-industry'
              icon='101'
              options={industryOptions}
              meta={meta}
            />
          )}
        </Field>
        <Field<string> name='company_interest' validate={required}>
          {({ input, meta }) => (
            <Select
              {...input}
              placeholder='Company Interest'
              label='Company Interest'
              name='ob-select-company-interest'
              id='ob-select-company-interest'
              icon='103'
              options={interestOptions}
              meta={meta}
            />
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
