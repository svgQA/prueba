// Tipos front para AccessBan (simple: interno con userId, externo con cardId/username)

export interface IAccessBan {
  id?: number;
  companyId?: number;

  // Interno
  userId?: number | null;
  user?: { id: number; name?: string; surname?: string } | null;

  // Externo
  cardId?: string | null;
  username?: string | null;

  reason?: string | null;
  expiresAt?: string | null; // ISO o null
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateAccessBan {
  // Interno (opcional)
  userId?: number | null;

  // Externo (requeridos si no hay userId)
  cardId?: string | null;
  username?: string | null;

  reason?: string | null;
  expiresAt?: string | null; // ISO
  isActive?: boolean;
  type: AccessBanType;
}

export type AccessBanType = 'BAN' | 'SPECIAL';

export type IUpdateAccessBan = Partial<ICreateAccessBan>;
