// import { TenantService } from '@/services';
import { UserService } from '@/services/general/user';
import { IJwtPayload, IUserResponse } from '@/types/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
// import { parsingCompanies } from './user.slice';
// import { ICompany } from './interface/user.interface';

/* 
const getTenancies = async (
  setCompanies: (companies: ICompany[]) => void,
  setSelected: (uuid: string) => void
): Promise<boolean> => {
  const response = await TenantService.get_my_tenants();
  // Corregir toda esta mierda porque tenant esta respondiendo como true
  //    a los errores (corregir tenant Service)
  if (!response.getStatus()) {
    setCompanies([]);
    return false;
  }
  const value = response.getOne();
  if (value.error) {
    setCompanies([]);
    return false;
  }

  const userTenants = parsingCompanies(value);
  setCompanies(userTenants);

  if (userTenants.length === 1) {
    setSelected(userTenants[0].id);
  }

  return userTenants.length < 2;
};
*/
export const getUserId = async (
  setToken?: (token: string) => void
): Promise<string | undefined> => {
  const session = await getUser(setToken);
  return session?.sub;
};

export const hasUserTenant = async (
  setToken: (token: string) => void,
  setCognito: (uuid: string) => void,
  setTenant: (uuid: string) => void,
  setUser: (user: IUserResponse) => void
): Promise<boolean> => {
  const user = await getUser(setToken);
  const cognito = user?.sub || '';
  const tenant = user?.['custom:tenant'] || '';

  setCognito(cognito);
  setTenant(tenant);

  const profile = await UserService.profile();
  if (!profile.getStatus()) return false;
  setUser(profile.getOne());
  return true;
};

export const updateToken = async (
  setToken: (token: string) => void
): Promise<void> => {
  const session = await fetchAuthSession();
  if (!session?.tokens?.accessToken) return;
  const token = session.tokens.accessToken.toString();
  setToken(token);
};

export const getUser = async (
  setToken?: (token: string) => void
): Promise<IJwtPayload | undefined> => {
  try {
    const session = await fetchAuthSession();
    if (!session?.tokens?.accessToken?.payload) return undefined;

    const token = session.tokens.accessToken.toString();
    const payload = session.tokens.accessToken
      .payload as unknown as IJwtPayload;
    setToken?.(token);
    return payload;
  } catch (error) {
    return undefined;
  }
};
