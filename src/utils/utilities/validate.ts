import { IOption } from '@/components/common/multi/interface';

export const required = (value: unknown) =>
  value ? undefined : 'required_field';

export const validateExactLength = (len: number) => (value: string) => {
  if (value && value.length !== len) {
    return `eql_len_${len}`;
  }
  return undefined;
};

export const lengthSize = (min: number, max: number) => (value: string) => {
  if (!value) return 'required_field';
  if (value && (value.length < min || value.length > max)) {
    return `ran_len_${min}_${max}`;
  }
  return undefined;
};

export const validatePhone = (value: string) => {
  if (!value) return 'required_field';
  if (!value.startsWith('+')) return 'phone_start_with';
  if (value.length < 8) return 'size_8';
  if (!/^\+\d{8,15}$/.test(value)) return 'invalid_format';
  return undefined;
};

export const validateOption = (value: IOption) => {
  if (!value || !value.label || !value.value) return 'required_field';
  return undefined;
};

export const validate_min_len =
  (min: number) =>
  (value: IOption[]): string | undefined => {
    if (!value) return 'required_field';
    if (value && value.length < min) {
      return `min_leng_${min}`;
    }
    return undefined;
  };

export const lengthSize_10 = (value: string) => {
  if (!value) return 'required_field';
  if (value && value.length < 10) {
    return `min_leng_10`;
  }
  return undefined;
};
