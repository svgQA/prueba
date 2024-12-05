import { VOX_DEFAULT_PATH, VOS_SERVICES } from './constants';
import { IMakeRequest, REQUEST_METHODS } from '../interface';
import { GenericResponse } from './rest-factory';
import { VoxServices } from '../types';
import { ICompany, IUser } from '@/store/slices/interface';

export class BaseService {
  protected static prefix: string = 'api';
  protected static openLoading: () => void = () => {};
  protected static closeLoading: () => void = () => {};
  protected static getSelected: () => ICompany | undefined = () => undefined;
  protected static getUser: () => IUser | null = () => null;

  public static setLoading(onOpen: () => void, onClose: () => void) {
    this.openLoading = onOpen;
    this.closeLoading = onClose;
  }

  public static setUser(
    getSelected: () => ICompany | undefined,
    getUser: () => IUser | null
  ) {
    this.getSelected = getSelected;
    this.getUser = getUser;
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
  ) {
    let url = this.make_url(model.url, instance, prefix);
    if (model.params) {
      const queryParams = new URLSearchParams();
      Object.entries(model.params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      url = `${url}?${queryParams.toString()}`;
    }
    const method = model?.method || REQUEST_METHODS.GET;
    if (method === REQUEST_METHODS.POST || method === REQUEST_METHODS.PUT) {
      if (!model.uncontent) {
        model.headers = {
          ...model?.headers,
          'Content-Type': 'application/json',
        };
        model.data = JSON.stringify(model.data || {});
      }
    }

    if (tenance) {
      const tenant = this.getSelected();
      const tenant_header = import.meta.env.VITE_TENANT_HEADER;
      if (!tenant_header || !tenant?.tenant_id) {
        throw new Error('ERROR: not include header');
      }
      model.headers = { ...model.headers, [tenant_header]: tenant.tenant_id };
    }

    const output = {
      header: model.headers as any,
      data: model.data,
      url,
      method,
    };
    return output;
  }

  static async make_request<T>(
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
    prefix?: boolean,
    tenance: boolean = true
  ): Promise<GenericResponse<T>> {
    this.openLoading();

    try {
      const model_request = this.make_request_model(
        instance,
        model,
        prefix,
        tenance
      );
      const response = await fetch(model_request.url, {
        headers: model_request.header,
        body: model.data,
        method: model.method,
      });

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
      // TODO: Agregar un modal si se presenta un error.
      console.error(error);
      throw new Error('ERROR: processing response');
    } finally {
      this.closeLoading();
    }
  }
}
