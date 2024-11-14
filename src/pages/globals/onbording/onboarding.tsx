import './assets/index.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { IOnboardingProps, DEFAULT_STEP, STEPS } from './utils';
import { Form } from 'react-final-form';
import { getUserId } from '@/store/slices';
import { IOnboardingModel } from '@/store/signals/types';
import { TenantService } from '@/services';
import { closeOnBoardingModal } from '@/store/signals/modals';
import { OnBoardingSteps } from './components';

export const OnBordingModal = ({ closed, onLogout }: IOnboardingProps) => {
  const [step, setStep] = useState<number>(DEFAULT_STEP);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, STEPS));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const onCreateTenant = async (model: IOnboardingModel) => {
    const admin_cognito = await getUserId();

    if (!admin_cognito) {
      return console.error('No existe usuario valido con ese uuid');
    }
    const response = await TenantService.create_tenant({
      ...model,
      admin_cognito,
    });
    if (response.getStatus()) {
      closeOnBoardingModal();
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${(step - 1) * 100}%)`;
    }
  }, [step]);

  return closed ? null : (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-95'>
      <Form
        onSubmit={onCreateTenant}
        subscription={{ submitting: true, pristine: true }}
        render={({ handleSubmit, values }) => (
          <form
            className='bg-white rounded-sm shadow-lg w-[65vw] overflow-hidden relative pt-10'
            onSubmit={handleSubmit}
          >
            <span
              onClick={onLogout}
              className='absolute top-0 right-2 p-2 text-gray-500 hover:text-gray-700 cursor-pointer'
              type='button'
            >
              <span className='vox-icon vx-icon-099' />
            </span>
            <span
              className={`top-0 right-8 absolute p-4 text-sm text-[#A5ACBA] mb-2 ${step > 1 ? 'visibe' : 'invisible'}`}
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
