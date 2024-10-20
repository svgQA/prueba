// import { TenantService } from '@/services';
import { fetchAuthSession } from 'aws-amplify/auth';
// import { JwtPayload } from '@aws-amplify/core/dist/esm/singleton/Auth/types';

// export const hasUserTenant = async (): Promise<boolean> => {
//   const user = await getUser();
//   if (!user) return false;
//   const tenant = user['custom:tenant'] as string;
//   if (!tenant) return false;
//   if (tenant.includes('public')) return false;
//   return true;
// };

export const hasUserTenant = async (): Promise<boolean> => {
  return true;
  // const user = await getUser();
  // if (!user?.sub) return false;
  // const response = await TenantService.get_my_tenants(user.sub);
  // if (!response.getStatus()) return false;
  // const userTenant = response.getOne()?.data;
  // if (!userTenant) return false;
  // return userTenant?.companies?.length > 0;
};

export const getUser = async (): Promise<any /* JwtPayload */ | undefined> => {
  const user = await fetchAuthSession();
  return user.tokens?.idToken?.payload;
};
