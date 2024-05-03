import { type IModelRequest } from './types.d';
import { HTTP_CONTENT_TYPES, REQUEST_METHODS } from './http-constants';
import { GenericResponse } from './rest-factory';

export class MakeRequest {
  async makeRequest<T>(
    url: string,
    params: IModelRequest
  ): Promise<GenericResponse<T>> {
    if (!url.startsWith('https') && import.meta.env.PROD) {
      throw Error('ERROR: Fail in security');
    }

    const method = params.method || REQUEST_METHODS.GET;
    const body =
      method !== REQUEST_METHODS.GET
        ? JSON.stringify(params?.data || {})
        : undefined;

    try {
      const response = await fetch(url, {
        headers: params?.headers,
        body,
        method,
      });
      let result;
      if (!response.ok) {
        throw await response.text();
      } else if (
        response?.headers
          ?.get('content-type')
          ?.includes(HTTP_CONTENT_TYPES.Json)
      ) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      return new GenericResponse<T>({
        code: response?.status,
        message: result?.message,
        data: result,
      });
    } catch (error: any) {
      const message =
        JSON.parse(error?.request?.response || `{"message": "${error}"}`)
          ?.message || 'ERROR: Not Found Data';
      throw new GenericResponse<T>({
        code: 404,
        message,
        data: {},
      });
    }
  }
}
