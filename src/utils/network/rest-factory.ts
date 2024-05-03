import { IGenericData } from './types';

export class GenericResponse<T> {
  private status: boolean;
  // private message: string;
  private data: T[] = [];
  private model: T;

  constructor(model: IGenericData) {
    // console.log(model);
    this.status = (model.code >= 200 && model.code < 300) || false;
    // this.message = model.message || '';
    const data = this.status ? model.data : [];
    if (data?.length) {
      this.data = data;
      this.model = {} as any;
    } else {
      this.data = [];
      this.model = data;
    }
  }

  /**
   * @returns boolean true if status of code is >= 200 &&
   * code < 300 otherwise return false
   */
  getStatus(): boolean {
    return this.status;
  }

  getMany(): T[] {
    return this.data;
  }

  getOne(): T {
    return this.data.length > 0 ? this.data[0] : this.model;
  }
}
