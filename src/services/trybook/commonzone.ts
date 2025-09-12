// services/trybook/commonzone.ts
import { type IPagination } from '@/types';

import { BaseService } from '@/utils/network';
import {
    IMakeRequest,
    REQUEST_METHODS,
    VoxServices,
} from '@/utils/network/types';

import {
    type ICommonZoneItem,
    type ICommonZoneCreate,
    type ICommonZoneUpdate,
    type ICommonZoneQuery,
} from '@/types/trybook/common-zone';

export class CommonZoneService extends BaseService {
    static common: VoxServices = 'user';

    // ─────────────────────────────────────────────────────────────
    // CommonZone
    // ─────────────────────────────────────────────────────────────

    /** Listar zonas comunes (con paginación y filtros opcionales) */
    static async getCommonZones(
        params: IPagination & ICommonZoneQuery = { page: 1, items: 1000 }
    ) {
        const model: IMakeRequest = {
            url: ['common-zones'],
            params: params as any,
        };
        // El wrapper de red mantiene su misma forma (getStatus/getMany),
        // tipamos el payload interno a ICommonZoneItem
        return await super.make_request<ICommonZoneItem>(this.common, model);
    }

    /** Obtener una zona común por ID */
    static async getCommonZone(id: number) {
        const model: IMakeRequest = {
            url: ['common-zones', String(id)],
        };
        return await super.make_request<ICommonZoneItem>(this.common, model);
    }

    /** Crear una o varias zonas comunes */
    static async createCommonZone(payload: ICommonZoneCreate | ICommonZoneCreate[]) {
        const model: IMakeRequest = {
            url: ['common-zones'],
            method: REQUEST_METHODS.POST,
            data: payload,
        };
        return await super.make_request<ICommonZoneItem>(this.common, model);
    }

    /** Actualizar una zona común por ID */
    static async updateCommonZone(id: number, payload: ICommonZoneUpdate) {
        const model: IMakeRequest = {
            url: ['common-zones', String(id)],
            method: REQUEST_METHODS.PUT,
            data: payload,
        };
        return await super.make_request<ICommonZoneItem>(this.common, model);
    }

    /** Eliminar (soft/hard según backend) una zona común por ID */
    static async deleteCommonZone(id: number) {
        const model: IMakeRequest = {
            url: ['common-zones', String(id)],
            method: REQUEST_METHODS.DELETE,
        };
        return await super.make_request<ICommonZoneItem>(this.common, model);
    }
}
