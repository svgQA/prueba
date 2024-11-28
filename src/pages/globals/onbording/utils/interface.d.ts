import { IOnboardingModel } from '@/store/signals/interface';
import { ICompany } from '@/store/slices/interface';
import { AuthEventData } from '@/types';
import { extend } from 'immutability-helper';
import { PropsWithChildren } from 'preact/compat';

export interface IOnboardingProps extends PropsWithChildren {
  closed?: boolean;
  onLogout: (data?: AuthEventData) => void;
}

interface IOnBoardingStepsProps extends PropsWithChildren {
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
