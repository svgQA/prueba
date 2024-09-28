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
  employeeCount: '',
};

export const employeeCountOptions = [
  '1-100',
  '101-200',
  '201-300',
  '301-400',
  '401-500',
  '501-600',
  '601-700',
  '701-800',
  '801-900',
  '901-1000',
  'Más de 1000',
];

export const STEPS = 6;
export const DEFAULT_STEP = 1;
