// src/types/trybook/common-zone.ts

/** Enum de tipos de zona común (alineado al formulario) */
export type ZoneType = 'PARKING' | 'POOL' | 'GYM' | 'OTHER';

/** Fila/Item que devuelve el backend para una zona común */
export interface ICommonZoneItem {
  id: number;
  companyId: number;

  placeId: number;
  place?: { id: number; name: string | null } | null;

  name: string;
  type: ZoneType;
  isActive?: boolean | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  createdBy?: unknown;
  editedBy?: unknown;
  deletedBy?: unknown;
}

/** Payload para CREAR zona común */
export interface ICommonZoneCreate {
  placeId: number;
  name: string;
  type: ZoneType;
  isActive?: boolean | null;
}

/** Payload para ACTUALIZAR zona común */
export type ICommonZoneUpdate = Partial<ICommonZoneCreate>;

/** Query opcional para listar (además de paginación) */
export interface ICommonZoneQuery {
  page?: number;
  items?: number;
  placeId?: number;
  type?: ZoneType;
  isActive?: boolean;
  q?: string; // búsqueda libre si el API lo soporta
}

/** Opción simple para selects */
export interface ICommonZoneOption {
  value: number;
  label: string;
}
