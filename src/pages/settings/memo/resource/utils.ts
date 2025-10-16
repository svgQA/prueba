import { IResourceRequest } from '@/types/memo/memo.request';

export const isE164 = (value: string) => /^\+[1-9]\d{7,14}$/.test(value.trim());

export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isHttpUrl = (value: string) => {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateContactByType = (
  value?: string,
  allValues?: Partial<IResourceRequest>
) => {
  const type = (allValues?.type as string) || 'WHATSAPP';
  const v = (value ?? '').trim();

  if (!v) return 'Este campo es requerido.';

  if (type === 'WHATSAPP') {
    if (!isE164(v)) {
      return 'Formato inválido. Usa E.164: +[código país][número] (p. ej., +34911222333).';
    }
  } else if (type === 'EMAIL') {
    if (!isEmail(v)) {
      return 'Introduce un email válido (p. ej., usuario@dominio.com).';
    }
  } else if (type === 'LINK') {
    if (!isHttpUrl(v)) {
      return 'Introduce una URL válida con http(s) (p. ej., https://ejemplo.com).';
    }
  }

  return undefined;
};

export const validateOptionalUrl = (value?: string) => {
  const v = (value ?? '').trim();
  if (!v) return undefined;
  return isHttpUrl(v) ? undefined : 'Introduce una URL válida con http(s).';
};
