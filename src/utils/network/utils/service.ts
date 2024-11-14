import { VOX_DEFAULT_PATH, VOS_SERVICES } from './constants';
import { IMakeRequest, REQUEST_METHODS } from '../interface';
import { GenericResponse } from './rest-factory';
import { VoxServices } from '../types';

export class BaseService {
  protected static prefix: string = 'api';
  protected static openLoading: () => void = () => {};
  protected static closeLoading: () => void = () => {};

  public static setLoading(open: () => void, close: () => void) {
    this.openLoading = open;
    this.closeLoading = close;
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
    prefix?: boolean
  ): Promise<GenericResponse<T>> {
    this.openLoading();
    let url = this.make_url(model.url, instance, prefix);

    if (model.params) {
      const queryParams = new URLSearchParams();
      Object.entries(model.params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      url = `${url}?${queryParams.toString()}`;
    }

    const method = model?.method || REQUEST_METHODS.GET;
    if (method === REQUEST_METHODS.POST) {
      model.headers = { ...model.headers, 'Content-type': 'application/json' };
      model.data = JSON.stringify(model.data || {});
    }

    try {
      const response = await fetch(url, {
        headers: model.headers,
        body: model.data,
        method,
      });
      const content_type = response.headers.get('content-type');
      if (content_type?.includes('application/json')) {
        const result = await response.json();
        this.closeLoading();
        return new GenericResponse<T>({
          code: response?.status,
          message: result?.message,
          data: result,
        });
      } else {
        const result = await response.text();
        this.closeLoading();
        return new GenericResponse<T>({
          code: response?.status,
          message: result,
          data: result,
        });
      }
    } catch (error: any) {
      const message =
        JSON.parse(error?.request?.response || `{"message": "${error}"}`)
          ?.message || 'ERROR: Not Found Data';
      this.closeLoading();
      return new GenericResponse<T>({
        code: 404,
        message,
        data: {},
      });
    }
  }
}
