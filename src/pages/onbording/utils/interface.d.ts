import { IOnboardingModel } from '@/store/signals/interface';
import { AuthEventData } from '@/types';

export interface IOnboardingProps {
  closed?: boolean;
  onLogout: (data?: AuthEventData) => void;
}
