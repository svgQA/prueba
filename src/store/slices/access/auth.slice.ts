import { TenantService } from '@/services';
import { fetchAuthSession } from 'aws-amplify/auth';
import { parsingCompanies } from './user.slice';
import { ICompany } from './interface/user.interface';

const getTenancies = async (
  uuid: string,
  setCompanies: (companies: ICompany[]) => void,
  setSelected: (uuid: string) => void
): Promise<boolean> => {
  const response = await TenantService.get_my_tenants(uuid);
  /* Corregir toda esta mierda porque tenant esta respondiendo como true
     a los errores (corregir tenant Service) */
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

export const getUserId = async (
  setToken?: (token: string) => void
): Promise<string | undefined> => {
  const user = await getUser(setToken);
  return user.sub;
};

export const hasUserTenant = async (
  setCompanies: (companies: ICompany[]) => void,
  setSelected: (uuid: string) => void,
  setToken: (token: string) => void
): Promise<boolean> => {
  const user = await getUserId(setToken);
  if (!user) return false;
  return getTenancies(user, setCompanies, setSelected);
};

export const getUser = async (
  setToken?: (token: string) => void
): Promise<any /* JwtPayload */ | undefined> => {
  const user = await fetchAuthSession();
  const token = user.tokens?.accessToken.toString() || '';
  setToken?.(token);
  return user.tokens?.accessToken?.payload;
};
