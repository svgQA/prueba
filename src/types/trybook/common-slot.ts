// src/types/trybook/common-slot.ts

/** Item (fila) de Common Slot que devuelve el backend */
export interface ICommonSlotItem {
  uuid: string;
  code: string | null;
  zoneId: number | null;
  isOccupied: boolean | null;

  zone?: {
    id: number | null;
    name: string | null;
    placeId: number | null;
    place?: { id: number | null; name: string | null } | null;
  } | null;

  placeId?: number | null;
  place?: { id: number | null; name: string | null } | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** Payload para crear un Common Slot */
export interface ICommonSlotCreate {
  zoneId: number;
  code: string;
  /** Si no envías, el back debería asumir false */
  isOccupied?: boolean;
}

/** Payload para actualizar (todos opcionales) */
export type ICommonSlotUpdate = Partial<ICommonSlotCreate>;

/** Query opcional para listar (además de paginación) */
export interface ICommonSlotQuery {
  page?: number;
  items?: number;
  /** Filtros opcionales si tu API los soporta */
  zoneId?: number;
  placeId?: number;
  q?: string;
}

/** Payload para ocupar un slot (check-in) */
export interface ICommonSlotOccupyPayload {
  /** Datos libres de check-in (hora, persona, etc.) */
  checkIn?: Record<string, any> | null;
  observations?: string | null;
  by?: { id?: number; name?: string } | null;
}

/** Payload para liberar un slot (check-out) */
export interface ICommonSlotFreePayload {
  /** Datos libres de check-out */
  checkOut?: Record<string, any> | null;
  by?: { id?: number; name?: string } | null;
}
