export const required = (value: unknown) =>
  value ? undefined : 'Campo obligatorio';

export const validateExactLength = (length: number) => (value: string) => {
  if (value && value.length !== length) {
    return `El campo debe tener exactamente ${length} caracteres.`;
  }
  return undefined;
};

export const lengthSize = (min: number, max: number) => (value: string) => {
  if (value && (value.length < min || value.length > max)) {
    return `El campo debe tener exactamente min ${min} y max ${max} caracteres.`;
  }
  return undefined;
};
