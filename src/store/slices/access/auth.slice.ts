import { fetchAuthSession } from 'aws-amplify/auth';
import { JwtPayload } from 'node_modules/@aws-amplify/core/dist/esm/singleton/Auth/types';

export const hasUserTenant = async (): Promise<boolean> => {
  const user = await getUser();
  if (!user) return false;
  const tenant = user['custom:tenant'] as string;
  if (!tenant) return false;
  if (tenant.includes('public')) return false;
  return true;
};

export const getUser = async (): Promise<JwtPayload | undefined> => {
  const user = await fetchAuthSession();
  return user.tokens?.idToken?.payload;
};
