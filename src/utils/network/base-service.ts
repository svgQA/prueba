import { MakeRequest } from './make-request';
import { IMakeRequest } from './types';
import { GenericResponse } from './rest-factory';
import { UCA_DEFAULT_PATH, UCA_DEFAULT_SERVICE_URL } from './constants';

export class BaseService {
  private base: string = '';
  private request = new MakeRequest();

  constructor(base: string = UCA_DEFAULT_SERVICE_URL) {
    this.base = base;
  }

  private makeUrl(path: string[]): string {
    const section = import.meta.env.PROD
      ? UCA_DEFAULT_PATH.PROD
      : UCA_DEFAULT_PATH.DEFAULT;
    const subdirectory = path.join(UCA_DEFAULT_PATH.DEFAULT);
    return `${this.base}${section}${subdirectory}`;
  }

  protected async makeRequest<T>(
    model: IMakeRequest
  ): Promise<GenericResponse<T>> {
    const { url, ...params } = model;
    const urlLine = this.makeUrl(url);
    return await this.request.makeRequest<T>(urlLine, params);
  }
}
