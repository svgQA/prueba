import i18n from '@/i18n';

type FieldValidator<T> = (value: T) => string | undefined;

/**
 * Composes multiple validators into a single validator
 * @param validators - Array of validators to compose
 * @returns A single validator that runs all validators
 */
export const composeValidators =
  (...validators: any[]) =>
  (value: any) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

export const validateNumber: FieldValidator<string> = (
  value: string
): string | undefined => {
  if (!value) return i18n.t('number_required');

  const numberRegex = /^\d{1,20}$/;

  if (!numberRegex.test(value)) {
    return i18n.t('number_length_1_20');
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
  if (!value) return i18n.t('email_required');

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return i18n.t('email_invalid');
  }

  return undefined;
};

export const validatePhone: FieldValidator<string> = (
  value: string
): string | undefined => {
  if (!value) return i18n.t('phone_required_13');

  const phoneRegex = /^\d{13}$/;

  if (!phoneRegex.test(value)) {
    return i18n.t('phone_invalid_13');
  }

  return undefined;
};

export const validateCardId: FieldValidator<string> = (
  value: string
): string | undefined => {
  if (!value) return i18n.t('card_id_required');

  const cardIdRegex = /^\d{5,20}$/;

  if (!cardIdRegex.test(value)) {
    return i18n.t('card_id_length_5_20');
  }

  return undefined;
};
