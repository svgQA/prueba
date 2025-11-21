import { type FunctionComponent, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useSignal } from '@preact/signals';
import { FormService } from '@/services/form/form';
import {
  RESPONSE_MODE_SERVICE,
  setResponse,
} from '../dashboard/forms/response/store/response';
import { FormResponsePublicPage } from '../dashboard/forms/response/public';

export const ResponsePublicPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const responseId = useSignal<string | null>(null);
  const tenant = useSignal<string | null>(null);

  useEffect(() => {
    document.title = t('d_pageTitle');

    // Capturar los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const responseIdParam = urlParams.get('responseId');
    const tenantParam = urlParams.get('tenant');

    responseId.value = responseIdParam;
    tenant.value = tenantParam;

    // Log para verificar que se capturaron correctamente
    console.log('responseId:', responseIdParam);
    console.log('tenant:', tenantParam);

    getResponse();
  }, [t]);

  const getResponse = async () => {
    const response = await FormService.get_structure_public(
      responseId.value ?? '',
      tenant.value ?? ''
    );
    if (response.getStatus()) {
      console.log('response:', response.getOne());
      setResponse(
        { mode: RESPONSE_MODE_SERVICE.UPDATE, id: response.getOne().id },
        response.getOne().structure
      );
    }
  };

  return (
    <>
      <h1>Response</h1>
      {responseId.value && <p>Response ID: {responseId.value}</p>}
      {tenant.value && <p>Tenant: {tenant.value}</p>}

      <FormResponsePublicPage posFinishAction={() => {}} type='VIEW' />
    </>
  );
};
