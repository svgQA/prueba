import { default_service_url } from '@/env.config';
import { Memo } from '@/pages/dashboard/memos/utils/memos';
import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export type MemosSummary = {
  total: number;
  in_progress: number;
  completed: number;
};

export class MemoService extends BaseService {
  static name: VoxServices = 'memo';
  private static eventSource: EventSource | null = null;
  private static listeners: ((data: any) => void)[] = [];

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['memo'],
      params: params as any,
    };
    return await super.make_request<Memo>(this.name, model);
  }

  /**
   * Gets a summary of memos including total count, in progress and completed
   * @returns Summary object with total, progress and completed counts
   */
  static async getMemosSummary() {
    const model: IMakeRequest = {
      url: ['memo/summary/stats'],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<MemosSummary>(this.name, model);
  }

  static async createMemo(data: any) {
    const model: IMakeRequest = {
      url: ['memo'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  //SSE
  static connectSSE(token: string) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    // Obtener el token de autenticación
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    // Remover el prefijo 'Bearer ' si existe
    const cleanToken = token.replace('Bearer ', '');

    // Agregar el token como query parameter
    const url = `${default_service_url}/memo/emitChangesMemos?token=${cleanToken}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE Connection opened');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        // Intentar reconectar después de un error
        setTimeout(() => {
          this.disconnectSSE();
          this.connectSSE(token);
        }, 5000);
      }
    };
  }

  static disconnectSSE() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  static addEventListener(listener: (data: any) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}
