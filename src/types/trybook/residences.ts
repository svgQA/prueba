/** Enums / básicos */
export type ResidenceType = 'HOUSE' | 'APARTMENT';

/** Fila completa que devuelve el backend */
export interface IResidenceItem {
  uuid: string;

  type: ResidenceType;
  houseNumber: string;
  block: string | null;
  floor: number | null;

  placeId: number;
  place?: { id: number; name: string | null } | null;

  userId: number;
  user?: {
    id: number;
    name: string | null;
    surname: string | null;
    email?: string | null;
  } | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** Payload para CREAR */
export interface IResidenceCreate {
  type: ResidenceType;
  houseNumber: string;
  block?: string | null; // si no envías, el back suele normalizar a ""
  floor?: number | null; // para APARTMENT; para HOUSE puede ser 0
  placeId: number;
  userId: number;
}

/** Payload para ACTUALIZAR (todos opcionales) */
export type IResidenceUpdate = Partial<IResidenceCreate>;

/** Query opcional para listar (además de paginación) */
export interface IResidenceQuery {
  page?: number;
  items?: number;
  type?: ResidenceType;
  placeId?: number;
  userId?: number;
  q?: string; // búsqueda libre si tu API la soporta
}

/** Opción simple (para combos / simple-list) */
export interface IResidenceOption {
  value: string; // uuid
  label: string;
  group?: string; // "Residence"
}
