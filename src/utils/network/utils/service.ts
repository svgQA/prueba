import { VOX_DEFAULT_PATH, VOS_SERVICES } from './constants';
import { IMakeRequest, REQUEST_METHODS } from '../interface';
import { GenericResponse } from './rest-factory';
import { VoxServices } from '../types';
import { company_header, tenant_header } from '@/env.config';
import i18n from '@/i18n';
import { VoxError } from '../error';
import { ToastManager } from '@/utils/toast/toast-manager';
import {
  getIsInErrorState,
  setIsInErrorState,
  setTypeOfError,
} from '@/store/signals/service/service.signals';

export interface IRequestModelOutput {
  header: Record<string, string>;
  data: string | FormData | null;
  url: string;
  method: REQUEST_METHODS;
}

export class BaseService {
  protected static prefix: string = 'api';
  protected static openLoading: () => void = () => {};
  protected static closeLoading: () => void = () => {};
  protected static getTenant: () => string = () => '';
  protected static getToken: () => string = () => 'Bearer';
  protected static getCompany: () => string = () => '';

  public static setLoading(onOpen: () => void, onClose: () => void) {
    this.openLoading = onOpen;
    this.closeLoading = onClose;
  }

  public static setUser(
    getTenant: () => string,
    getToken: () => string,
    getCompany: () => string
  ) {
    this.getTenant = getTenant;
    this.getToken = getToken;
    this.getCompany = getCompany;
  }

  private static make_url(
    paths: string[],
    base: VoxServices,
    prefix?: boolean
  ): string {
    const model = prefix ? [this.prefix, ...paths] : paths;
    const subdirectory = model.join(VOX_DEFAULT_PATH.DEFAULT);
    const urlBase = VOS_SERVICES[base];
    const urlTotal = `${urlBase}/${subdirectory}`;
    return urlTotal;
  }

  protected static make_request_model(
    instance: VoxServices,
    model: IMakeRequest,
    prefix?: boolean,
    tenance: boolean = true
  ): IRequestModelOutput {
    let url = this.make_url(model.url, instance, prefix);
    if (model.params) {
      const queryParams = new URLSearchParams();
      Object.entries(model.params).forEach(([key, value]) => {
        if (value && key) {
          queryParams.append(key, String(value));
        }
      });
      url = `${url}?${queryParams.toString()}`;
    }
    const method = model?.method || REQUEST_METHODS.GET;

    // Obtener el idioma actual de i18n
    const currentLanguage = i18n.language;
    model.headers = {
      ...model?.headers,
      'Accept-Language': currentLanguage,
    };

    if (method === REQUEST_METHODS.POST || method === REQUEST_METHODS.PUT) {
      if (!model.uncontent) {
        model.headers = {
          ...model.headers,
          'Content-Type': 'application/json',
        };
        model.data = JSON.stringify(model.data || {});
      }
    }

    if (tenance) {
      const tenant = this.getTenant();
      const company = this.getCompany();

      if (!tenant_header || !tenant) {
        // console.log('ERROR: ', model.url);
        ToastManager.error('error.not_found_tenant');
        throw new Error('ERROR: not include tenant header');
      }

      if (!company_header || !company) {
        // console.log('ERROR: ', model.url);
        ToastManager.error('error.not_found_company');
        throw new Error('ERROR: not include company header');
      }

      model.headers = {
        ...model.headers,
        [tenant_header]: tenant,
        [company_header]: company,
      };
    }
    model.headers = {
      ...model.headers,
      Authorization: this.getToken(),
    };

    const output: IRequestModelOutput = {
      header: model.headers as Record<string, string>,
      data: model.data,
      url,
      method,
    };
    return output;
  }

  static async make_request<T = any>(
    instance: VoxServices,
    /* FIX:
     Pasar a usar unicamente el nombre del micro, porque esto va a
       ser administrado unicamente por un gateway que redirecciona todo
        el trafico segun el nombre del servicio (por tanto solo quedara
        un unico punto de acceso, pero se diferencia por el nombre del
        servicio):
        https://voxline.com/<base>/<service>/...

        https://voxline.com/api/auth/...
        https://voxline.com/api/shift/...
        https://voxline.com/api/form/...
     */
    model: IMakeRequest,
    tenance: boolean = true,
    prefix: boolean = false
  ): Promise<GenericResponse<T>> {
    //  Valida si existe un error en la aplicación, para evitar peticiones innecesarias
    if (getIsInErrorState()) {
      return new GenericResponse<T>({
        code: 0,
        message: 'Existe un error en la aplicación',
        data: {},
      });
    }
    this.openLoading();
    const model_request = this.make_request_model(
      instance,
      model,
      prefix,
      tenance
    );

    try {
      const response = await fetch(model_request.url, {
        headers: model_request.header,
        body: model.data,
        method: model.method,
      });

      if (!response.ok) {
        const result = (await response.json()) as VoxError;
        if (Number(result.code) === 401) {
          setIsInErrorState(true);
          setTypeOfError('authorization');
        }
        return new GenericResponse<T>({
          code: response?.status,
          message: result?.message,
          data: {},
        });
      }

      const content_type = response.headers.get('content-type');
      if (content_type?.includes('application/json')) {
        const result = await response.json();
        return new GenericResponse<T>({
          code: response?.status,
          message: result?.message,
          data: result,
        });
      } else {
        const result = await response.text();
        return new GenericResponse<T>({
          code: response?.status,
          message: result,
          data: result,
        });
      }
    } catch (error: unknown) {
      setIsInErrorState(true);
      setTypeOfError('network');
      throw new Error('ERROR: processing response');
    } finally {
      this.closeLoading();
    }
  }
}
