export interface IOnboardingProps {
  onFinished: (IOnboardingModel) => void;
}

export interface IOnboardingModel {
  adminName: string;
  adminPhone: string;
  adminAddress: string;
  companyName: string;
  companyNIT: string;
  companyLocation: string;
  companyIndustry: string;
  serviceOfInterest: string;
  employeeCount: number;
}
