import { IOption } from '@/components/common/multi/interface';
import i18n from '@/i18n';

export const required = (value: unknown) =>
  value ? undefined : i18n.t('required_field');

export const validateExactLength = (len: number) => (value: string) => {
  if (value && value.length !== len) {
    return `${i18n.t('eql_len')} ${len}`;
  }
  return undefined;
};

export const lengthSize = (min: number, max: number) => (value: string) => {
  if (!value) return i18n.t('required_field');
  if (value && (value.length < min || value.length > max)) {
    return `${i18n.t('ran_len')} ${min} - ${max}`;
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
  if (!value || !value.label || !value.value) return i18n.t('required_field');
  return undefined;
};

export const validate_min_len =
  (min: number) =>
  (value: IOption[]): string | undefined => {
    if (!value) return i18n.t('required_field');
    if (value && value.length < min) {
      return `${i18n.t('min_len')} ${min}`;
    }
    return undefined;
  };

export const lengthSize_10 = (value: string) => {
  if (!value) return i18n.t('required_field');
  if (value && value.length < 10) {
    return `${i18n.t('min_len')} ${10}`;
  }
  return undefined;
};
