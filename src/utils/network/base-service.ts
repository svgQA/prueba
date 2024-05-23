import { MakeRequest } from './make-request';
import { IMakeRequest } from './types';
import { GenericResponse } from './rest-factory';
import { VOX_DEFAULT_PATH, VOX_DEFAULT_SERVICE_URL } from './constants';

export class BaseService {
  private base: string = '';
  private prefix: string = '';
  private request = new MakeRequest();

  constructor(base: string = VOX_DEFAULT_SERVICE_URL, prefix: string = '') {
    this.base = base;
    this.prefix = prefix;
  }

  private makeUrl(path: string[]): string {
    const model = [this.prefix, ...path];
    const subdirectory = model.join(VOX_DEFAULT_PATH.DEFAULT);
    return `${this.base}/${subdirectory}`;
  }

  protected async makeRequest<T>(
    model: IMakeRequest
  ): Promise<GenericResponse<T>> {
    const { url, ...params } = model;
    const urlLine = this.makeUrl(url);
    return await this.request.makeRequest<T>(urlLine, params);
  }
}
