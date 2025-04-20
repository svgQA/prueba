// import { TenantService } from '@/services';
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
  setUserId: (uuid: string) => void,
  setTenant: (uuid: string) => void
  // setCompanies: (companies: ICompany[]) => void,
  // setSelected: (uuid: string) => void,
  // setCognito: (uuid: string) => void
): Promise<boolean> => {
  const user = await getUser(setToken);
  setUserId(user?.sub || '');
  setTenant(user?.['custom:tenant'] || '');
  return true;
  // const user = await getUserId(setToken);
  // if (!user) return false;
  // setCognito(user);
  // return getTenancies(setCompanies, setSelected);
};

interface JwtPayload {
  auth_time: number;
  client_id: string;
  'custom:tenant': string;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  origin_jti: string;
  scope: string;
  sub: string;
  token_use: string;
  username: string;
}

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
): Promise<JwtPayload | undefined> => {
  try {
    const session = await fetchAuthSession();
    if (!session?.tokens?.accessToken?.payload) return undefined;

    const token = session.tokens.accessToken.toString();
    const payload = session.tokens.accessToken.payload as unknown as JwtPayload;
    setToken?.(token);
    return payload;
  } catch (error) {
    return undefined;
  }
};
