import { IOnboardingModel } from '@/store/signals/interface';
import { AuthEventData } from '@/types';

export interface IOnboardingProps {
  closed?: boolean;
  onLogout: (data?: AuthEventData) => void;
}

interface IOnBoardingStepsProps {
  sliderRef: any;
  values: any;
}

interface IOnBoardingStepProps extends PropsWithChildren {
  title?: string;
}
