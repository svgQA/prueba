import { IOnboardingModel } from '@/store/signals/interface';
import { ICompany } from '@/store/slices/interface';
import { AuthEventData } from '@/types';

export interface IOnboardingProps {
  closed?: boolean;
  onLogout: (data?: AuthEventData) => void;
}

interface IOnBoardingStepsProps {
  sliderRef: any;
  values?: any;
  onCurrentStep?: (step: number) => void;
}

interface IOnBoardingStepProps extends PropsWithChildren {
  title?: string;
}

interface CompanyOptionProps {
  company: ICompany;
  onSelect: (companyId: string) => void;
}
