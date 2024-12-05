import { FunctionComponent } from 'preact';
import { IOnBoardingStepProps } from '../utils';
import { memo } from 'preact/compat';

export const OnBoardingStep: FunctionComponent<IOnBoardingStepProps> = memo(
  ({ children, title }) => {
    return (
      <div className='onboarding-slide onboarding-step'>
        <h2 className='text-xl font-bold'>{title}</h2>
        <div className='flex-1 flex flex-col justify-center items-center max-w-[90vw]'>
          {children}
        </div>
      </div>
    );
  }
);
