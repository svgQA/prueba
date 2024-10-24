import { IOnboardingModel } from '@/store/signals/types';

interface ICreateTenantModel {
  user: {
    name: string;
    phone: string;
    address: string;
    cognito: string;
  };
  company: {
    name: string;
    nit: string;
    address: string;
    type: string;
    services: [string];
  };
  tenant: {
    name: string;
  };
}

export const onboarding2Tenant = (
  data: IOnboardingModel
): ICreateTenantModel => {
  return {
    user: {
      name: data.admin_name,
      phone: data.admin_phone,
      address: data.admin_address,
      cognito: data.admin_cognito,
    },
    company: {
      name: data.company_name,
      nit: data.company_nit,
      address: data.company_address,
      type: data.company_industry,
      services: ['any'],
    },
    tenant: {
      name: data.company_name,
    },
  };
};
