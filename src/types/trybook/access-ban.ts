// Tipos front para AccessBan
export interface IAccessBan {
  id?: number;
  companyId?: number;

  userId?: number | null;
  user?: { id: number; name?: string; surname?: string } | null;

  reason?: string | null;
  expiresAt?: string | null;  // ISO (o null)
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateAccessBan {
  userId?: number | null;
  reason?: string | null;
  expiresAt?: string | null;  // ISO
  isActive?: boolean;
}

export type IUpdateAccessBan = Partial<ICreateAccessBan>;
