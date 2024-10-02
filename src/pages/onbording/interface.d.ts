import { IOnboardingModel } from '@/store/signals/interface';

export interface IOnboardingProps {
  onSubmit: (IOnboardingModel) => void;
  closed?: boolean;
}
