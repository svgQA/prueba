import { cdn_service_url } from '@/env.config';
import { IPresignedRequest } from '@/types/file';

export const getUrlImage = (
  file: IPresignedRequest,
  tenant: string,
  company: number | string
) => {
  const _company = file.area === 'general' ? 0 : company;
  const validation = `${cdn_service_url}/${tenant}/${_company}/${file.area}/${file.uuid}-${file.name}`;
  return validation;
};
