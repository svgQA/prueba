/** ================================
 *  Enums / básicos
 *  ================================ */
export type SiteType = 'HOUSE' | 'APARTMENT' | 'OFFICE';

/** ================================
 *  Fila completa que devuelve el backend
 *  ================================ */
export interface ISiteItem {
  uuid: string;

  type: SiteType;
  houseNumber: string;
  block: string | null;
  floor: number | null;

  placeId: number;
  place?: { id: number; name: string | null; type?: 'INDUSTRIAL' | 'RESIDENTIAL' | 'OTHER' } | null;

  /** 
   * Dueño(s) / residentes cuando NO es oficina-industrial.
   * N:M ligero para frontend.
   */
  users?: Array<{
    id: number;
    name: string | null;
    surname: string | null;
    email?: string | null;
  }> | null;

  /**
   * Cliente (Company) cuando sea Oficina en Place INDUSTRIAL.
   */
  clientCompanyId?: number | null;
  clientCompanyName?: string | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** ================================
 *  Payload para CREAR
 *  ================================ */
export interface ISiteCreate {
  type: SiteType;
  houseNumber: string;
  block?: string | null; // si no envías, el back normaliza a ""
  floor?: number | null; // APARTMENT usa floor; HOUSE/OFFICE puede ser 0
  placeId: number;

  /**
   * Regla:
   * - Si type === 'OFFICE' y el place es INDUSTRIAL => usar clientCompanyId
   * - En otro caso => userId o residentUserIds (opcional N:M)
   */
  userId?: number;              // compat simple (uno)
  residentUserIds?: number[];   // N:M
  clientCompanyId?: number;     // cliente para oficina-industrial
}

/** ================================
 *  Payload para ACTUALIZAR
 *  ================================ */
export type ISiteUpdate = Partial<ISiteCreate>;

/** ================================
 *  Query opcional para listar (además de paginación)
 *  ================================ */
export interface ISiteQuery {
  page?: number;
  items?: number;
  type?: SiteType;
  placeId?: number;
  userId?: number;         // si filtras por algún residente
  clientCompanyId?: number; // si filtras por cliente (oficina-industrial)
  q?: string;              // búsqueda libre si tu API la soporta
}

/** ================================
 *  Opción simple (para combos / simple-list)
 *  ================================ */
export interface ISiteOption {
  value: string; // uuid
  label: string;
  group?: string; // "Site"
}

/* ==========================================================
 *  👇 Compatibilidad: alias con nombres antiguos (Residence)
 *  ========================================================== */
export type ResidenceType = SiteType;
export interface IResidenceItem extends ISiteItem {}
export interface IResidenceCreate extends ISiteCreate {}
export type IResidenceUpdate = ISiteUpdate;
export interface IResidenceQuery extends ISiteQuery {}
export interface IResidenceOption extends ISiteOption {}
