type FieldValidator<T> = (value: T) => string | undefined;

/**
 * Composes multiple validators into a single validator
 * @param validators - Array of validators to compose
 * @returns A single validator that runs all validators
 */
export const composeValidators = (...validators: FieldValidator<any>[]) => {
  return (value: any): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };
};

export const validateNumber: FieldValidator<string> = (
  value: string
): string | undefined => {
  if (!value) return 'El número es requerido';

  const numberRegex = /^\d{1,20}$/;

  if (!numberRegex.test(value)) {
    return 'El número debe tener entre 1 y 20 dígitos';
  }

  return undefined;
};

/**
 * Validates if a string is a valid email address
 * @param value - The string to validate
 * @returns true if valid, error message if invalid
 */
export const validateEmail: FieldValidator<string> = (
  value: string
): string | undefined => {
  if (!value) return 'El correo electrónico es requerido';

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Por favor ingrese un correo electrónico válido';
  }

  return undefined;
};

export const validatePhone: FieldValidator<string> = (
  value: string
): string | undefined => {
  if (!value) return 'El teléfono es requerido';

  const phoneRegex = /^\d{13}$/;

  if (!phoneRegex.test(value)) {
    return 'Por favor ingrese un teléfono válido';
  }

  return undefined;
};

export const validateCardId: FieldValidator<string> = (
  value: string
): string | undefined => {
  if (!value) return 'El número de documento es requerido';

  const cardIdRegex = /^\d{5,20}$/;

  if (!cardIdRegex.test(value)) {
    return 'El número de documento debe tener entre 5 y 20 dígitos';
  }

  return undefined;
};
