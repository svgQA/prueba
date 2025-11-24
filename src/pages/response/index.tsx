import { type FunctionComponent, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useSignal } from '@preact/signals';
import { useLocation } from 'wouter';
import { FormService } from '@/services/form/form';
import {
  RESPONSE_MODE_SERVICE,
  setResponse,
} from '../dashboard/forms/response/store/response';
import { FormResponsePublicPage } from '../dashboard/forms/response/public';

interface IResponseUser {
  name?: string;
  surname?: string;
  email?: string;
  image?: { file?: string };
}

interface IResponseCompany {
  name?: string;
}

export const ResponsePublicPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();

  const responseId = useSignal<string | null>(null);
  const tenant = useSignal<string | null>(null);
  const user = useSignal<IResponseUser | null>(null);
  const company = useSignal<IResponseCompany | null>(null);

  useEffect(() => {
    document.title = t('p_response');

    // Capturar los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const responseIdParam = urlParams.get('responseId');
    const tenantParam = urlParams.get('tenant');

    responseId.value = responseIdParam;
    tenant.value = tenantParam;

    getResponse();
  }, [t]);

  const getResponse = async () => {
    const response = await FormService.get_structure_public(
      responseId.value ?? '',
      tenant.value ?? ''
    );
    if (!response.getStatus()) {
      navigate('/');
      return;
    }
    const responseData: any = response.getOne();
    user.value = responseData?.user ?? null;
    company.value = responseData?.company ?? null;
    setResponse(
      { mode: RESPONSE_MODE_SERVICE.UPDATE, id: responseData.id },
      responseData.structure
    );
  };

  return (
    <FormResponsePublicPage
      posFinishAction={() => {}}
      type='VIEW'
      user={user.value}
      company={company.value}
    />
  );
};
