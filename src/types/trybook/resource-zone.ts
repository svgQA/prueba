/** Tipos base */
export type ResourceZoneType = 'EQUIPMENT' | 'TOOL' | 'GAME' | 'OTHER';

export interface IResourceZoneItem {
  id: number;
  companyId: number;

  zoneId: number;
  zone?: {
    id: number;
    name: string | null;
    type?: string | null;
    placeId?: number | null;
    place?: { id?: number | null; name?: string | null } | null;
  } | null;

  name: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;

  type: ResourceZoneType;

  quantity?: number | null; // total disponibles (si aplica)
  isBookable?: boolean | null; // se puede reservar
  requiresApproval?: boolean | null; // requiere aprobación
  minDurationMinutes?: number | null;
  maxDurationMinutes?: number | null;
  bufferMinutes?: number | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** Payload para CREAR */
export interface IResourceZoneCreate {
  name: string;
  type: ResourceZoneType;
  zoneId: number;

  quantity?: number | null;
  isBookable?: boolean | null;
  requiresApproval?: boolean | null;
  minDurationMinutes?: number | null;
  maxDurationMinutes?: number | null;
  bufferMinutes?: number | null;

  description?: string | null;
  image?: string | null;
  icon?: string | null;
}

/** Payload para ACTUALIZAR */
export type IResourceZoneUpdate = Partial<IResourceZoneCreate>;

/** Query de listado (además de paginación) */
export interface IResourceZoneQuery {
  page?: number;
  items?: number;
  zoneId?: number;
  type?: ResourceZoneType;
  q?: string; // búsqueda libre si el API la soporta
}

/** Opción simple (para selects) */
export interface IResourceZoneOption {
  value: number;
  label: string;
}
