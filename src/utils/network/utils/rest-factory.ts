import { ToastManager } from '@/utils/toast/toast-manager';
import { IGenericData } from '../interface';

export class GenericResponse<T> {
  private status: boolean;
  private data: T[] = [];
  private model: T | any;

  constructor(model: IGenericData) {
    this.status = (model.code >= 200 && model.code < 300) || false;
    if (!this.status) {
      ToastManager.error(model.message);
    }
    const data = this.status ? model.data : [];
    if (Array.isArray(data)) {
      this.data = data;
      this.model = {} as T;
    } else {
      this.data = [];
      this.model = data as T;
    }
  }

  showMessage() {}
  /**
   * @returns boolean true if status of code is >= 200 &&
   * code < 300 otherwise return false
   */
  getStatus(): boolean {
    return this.status;
  }

  getMany(): T[] {
    return this.data.length > 0 ? this.data : this.model?.data || [];
  }

  getOne(): T {
    return this.data.length > 0 ? this.data[0] : this.model || {};
  }
}
