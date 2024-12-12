import './assets/index.css';
import { useRef, useEffect, useCallback } from 'preact/hooks';
import { IOnboardingProps, DEFAULT_STEP, STEPS } from './utils';
import { Form } from 'react-final-form';
import { getUserId } from '@/store/slices';
import { IOnboardingModel } from '@/store/signals/types';
import { TenantService } from '@/services';
import { closeOnBoardingModal } from '@/store/signals/modals';
import { OnBoardingSteps } from './components';
import { Modal } from '@/components/common';
import { ThemeButton } from '@/components/compose';
import { useSignal } from '@preact/signals';

export const OnBordingModal = ({ closed, children }: IOnboardingProps) => {
  const step = useSignal<number>(DEFAULT_STEP);
  const sliderRef = useRef<HTMLDivElement>(null);
  const admin_cognito = useRef<string>();

  const handleNext = useCallback(() => {
    step.value = Math.min(step.value + 1, STEPS);
  }, []);

  const handlePrev = useCallback(() => {
    step.value = Math.max(step.value - 1, 1);
  }, []);

  const onCreateTenant = useCallback(async (model: IOnboardingModel) => {
    if (!admin_cognito.current) {
      admin_cognito.current = await getUserId();
    }

    if (!admin_cognito.current) {
      return console.error('No existe usuario valido con ese uuid');
    }

    const response = await TenantService.create_tenant({
      ...model,
      admin_cognito: admin_cognito.current,
    });

    if (response.getStatus()) {
      closeOnBoardingModal();
    }
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${(step.value - 1) * 100}%)`;
    }
  }, [step.value]);

  const headerContent = (
    <>
      <ThemeButton />
      <span
        className={`text-sm px-3 ${step.value > 1 ? 'visibe' : 'invisible'}`}
      >
        Paso {step.value - 1} de {STEPS}
      </span>
    </>
  );

  const footerContent = (
    <>
      <button
        className={`onboarding-buttons bg-primary ${step.value > 1 ? 'visible' : 'invisible'}`}
        type='button'
        onClick={handlePrev}
      >
        Anterior
      </button>
      <button
        className={`onboarding-buttons bg-primary ${step.value === STEPS ? 'invisible' : 'visible'}`}
        type='button'
        onClick={handleNext}
      >
        Siguiente
      </button>
      <button
        className={`onboarding-buttons bg-secondary ${step.value === STEPS ? 'visible' : 'invisible'}`}
        type='submit'
      >
        Finalizar
      </button>
    </>
  );

  return (
    <Modal
      open={!closed}
      name='onboarding-modal'
      header={headerContent}
      footer={footerContent}
    >
      {/* width='min-w-[500px] max-w-[800px]' */}
      <div>
        <Form
          onSubmit={onCreateTenant}
          subscription={{ submitting: true, pristine: true }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <OnBoardingSteps sliderRef={sliderRef}>
                {children}
              </OnBoardingSteps>
            </form>
          )}
        ></Form>
      </div>
    </Modal>
  );
};
