import { FunctionComponent } from 'preact';
import { IOnBoardingStepProps } from '../utils';

export const OnBoardingStep: FunctionComponent<IOnBoardingStepProps> = ({
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
