import { IOnboardingModel } from './interface';

export const INIT_ONBOARDING_MODEL_STATE: IOnboardingModel = {
  adminName: '',
  adminPhone: '',
  adminAddress: '',
  companyName: '',
  companyNIT: '',
  companyLocation: '',
  companyIndustry: '',
  serviceOfInterest: '',
  employeeCount: 0,
};

export const STEPS = 6;
export const DEFAULT_STEP = 1;
