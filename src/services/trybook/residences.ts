import { type IPagination } from '@/types';
import { IUserResidenceRequest } from '@/types/user/user.request';

import { BaseService } from '@/utils/network';
import {
    IMakeRequest,
    REQUEST_METHODS,
    VoxServices,
} from '@/utils/network/types';

export class ResidencesService extends BaseService {
    static name: VoxServices = 'user';

    // ─────────────────────────────────────────────────────────────
    // Residences
    // ─────────────────────────────────────────────────────────────

    static async createResidence(data: IUserResidenceRequest) {
        const model: IMakeRequest = {
            url: ['residence'],
            method: REQUEST_METHODS.POST,
            data,
        };
        return await super.make_request<any>(this.name, model);
    }

    static async getResidences(params: IPagination = { page: 1, items: 1000 }) {
        const model: IMakeRequest = {
            url: ['residence'],
            params: params as any,
        };
        return await super.make_request<any>(this.name, model);
    }

    static async getResidence(id: string) {
        const model: IMakeRequest = {
            url: ['residence', String(id)],
            method: REQUEST_METHODS.GET,
        };
        return await super.make_request<any>(this.name, model);
    }

    static async updateResidence(id: string, data: IUserResidenceRequest) {
        const model: IMakeRequest = {
            url: ['residence', String(id)],
            method: REQUEST_METHODS.PUT,
            data,
        };
        return await super.make_request<any>(this.name, model);
    }

    static async deleteResidence(id: string) {
        const model: IMakeRequest = {
            url: ['residence', String(id)],
            method: REQUEST_METHODS.DELETE,
        };
        return await super.make_request<any>(this.name, model);
    }

}
