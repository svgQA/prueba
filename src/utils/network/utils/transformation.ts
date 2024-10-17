import { IOnboardingModel } from '@/store/signals/types';

interface ICreateTenantModel {
  owner: {
    name: string;
    phone: string;
    address: string;
  };
  company: {
    name: string;
    nit: string;
    location: string;
    type_company: string;
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
    owner: {
      name: data.admin_name,
      phone: data.admin_phone,
      address: data.admin_address,
    },
    company: {
      name: data.company_name,
      nit: data.company_nit,
      location: data.company_address,
      type_company: data.company_industry,
      services: ['any'],
    },
    tenant: {
      name: data.company_name,
    },
  };
};
