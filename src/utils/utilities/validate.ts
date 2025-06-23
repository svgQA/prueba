import { IOption } from '@/components/common/multi/interface';

export const required = (value: unknown) =>
  value ? undefined : 'Campo obligatorio';

export const validateExactLength = (length: number) => (value: string) => {
  if (value && value.length !== length) {
    return `El campo debe tener exactamente ${length} caracteres.`;
  }
  return undefined;
};

export const lengthSize = (min: number, max: number) => (value: string) => {
  if (!value) return 'Campo obligatorio';
  if (value && (value.length < min || value.length > max)) {
    return `El campo debe tener exactamente min ${min} y max ${max} caracteres.`;
  }
  return undefined;
};

export const validatePhone = (value: string) => {
  if (!value) return 'El teléfono es requerido';
  if (!value.startsWith('+')) return 'El teléfono debe comenzar con +';
  if (value.length < 8) return 'El teléfono debe tener al menos 8 dígitos';
  if (!/^\+\d{8,15}$/.test(value)) return 'Formato de teléfono inválido';
  return undefined;
};

export const validateOption = (value: IOption) => {
  if (!value || !value.label || !value.value) return 'Campo obligatorio';
  return undefined;
};

export const lengthSize_10 = (value: string) => {
  if (!value) return 'Campo obligatorio';
  if (value && value.length < 10) {
    return 'El campo debe tener min 10 carácteres';
  }
  return undefined;
};
