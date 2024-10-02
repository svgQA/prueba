import { IOnboardingModel } from '@/store/signals/interface';

export interface IOnboardingProps {
  onFinished: (IOnboardingModel) => void;
  closed?: boolean;
}
