import { type IPagination } from '@/types';

import { BaseService } from '@/utils/network';
import {
    IMakeRequest,
    REQUEST_METHODS,
    VoxServices,
} from '@/utils/network/types';

export class CommonZoneService extends BaseService {
    static common: VoxServices = 'user';

    // ─────────────────────────────────────────────────────────────
    // CommonZone
    // ─────────────────────────────────────────────────────────────
    static async getCommonZones(params: IPagination = { page: 1, items: 1000 }) {
        const model: IMakeRequest = {
            url: ['common-zones'],
            params: params as any,
        };
        return await super.make_request<any>(this.common, model);
    }

    static async getCommonZone(id: number) {
        const model: IMakeRequest = {
            url: ['common-zones', String(id)],
        };
        return await super.make_request<any>(this.common, model);
    }

    static async createCommonZone(payload: any | any[]) {
        const model: IMakeRequest = {
            url: ['common-zones'],
            method: REQUEST_METHODS.POST,
            data: payload,
        };
        return await super.make_request<any>(this.common, model);
    }

    static async updateCommonZone(id: number, payload: any) {
        const model: IMakeRequest = {
            url: ['common-zones', String(id)],
            method: REQUEST_METHODS.PUT,
            data: payload,
        };
        return await super.make_request<any>(this.common, model);
    }

    static async deleteCommonZone(id: number) {
        const model: IMakeRequest = {
            url: ['common-zones', String(id)],
            method: REQUEST_METHODS.DELETE,
        };
        return await super.make_request<any>(this.common, model);
    }

}
