import { IOption } from '@/components/common/multi/interface';
import i18n from '@/i18n';

//TODO: por el momento se usa i18, es necesario implementar un Hook para manejar de cambio de lenguaje
export const required = (value: unknown) =>
  value ? undefined : i18n.t('required_field');

export const validateExactLength = (len: number) => (value: string) => {
  if (value && value.length !== len) {
    return i18n.t('eql_len_param', { len });
  }
  return undefined;
};

export const lengthSize = (min: number, max: number) => (value: string) => {
  if (!value) return i18n.t('required_field');
  if (value && (value.length < min || value.length > max)) {
    return i18n.t('ran_len_param', { min, max });
  }
  return undefined;
};

export const validatePhone = (value: string) => {
  if (!value) return i18n.t('required_field');
  if (!value.startsWith('+')) return i18n.t('phone_start_with');
  if (value.length < 8) return i18n.t('size_8');
  if (!/^\+\d{8,15}$/.test(value)) return i18n.t('invalid_format');
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
      return i18n.t('min_leng', { min });
    }
    return undefined;
  };

export const lengthSize_10 = (value: string) => {
  if (!value) return i18n.t('required_field');
  if (value && value.length < 10) {
    return i18n.t('min_leng', { min: 10 });
  }
  return undefined;
};
