import type { FilterExpression, Condition, Group } from '../types';

export interface User {
  nombre?: string;
  cognito?: string;
  address?: string;
  correo?: string;
  alias?: string;
  telefono?: string;
  canal?: string;
  roles?: string;
  perfil?: string;
  compañía?: string;
  departamento?: string;
  puesto?: string;
}

export const evaluateCondition = (
  user: User,
  condition: Condition
): boolean => {
  const userValue = user[condition.field];

  switch (condition.operator) {
    case '=':
      return userValue === condition.value;
    case '!=':
      return userValue !== condition.value;
    case 'like':
      return (
        typeof userValue === 'string' &&
        typeof condition.value === 'string' &&
        userValue.toLowerCase().includes(condition.value.toLowerCase())
      );
    case 'starts with':
      return (
        typeof userValue === 'string' &&
        typeof condition.value === 'string' &&
        userValue.toLowerCase().startsWith(condition.value.toLowerCase())
      );
    case 'is defined':
      return userValue !== undefined && userValue !== null && userValue !== '';
    case 'is undefined':
      return userValue === undefined || userValue === null || userValue === '';
    default:
      return false;
  }
};

export const evaluateGroup = (user: User, group: Group): boolean => {
  const results = group.conditions.map((cond) => {
    if (cond.type === 'condition') {
      return evaluateCondition(user, cond);
    } else {
      return evaluateGroup(user, cond);
    }
  });

  return group.logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
};

export const doesUserMatchFilter = (
  user: User,
  filter: FilterExpression
): boolean => {
  return filter.type === 'condition'
    ? evaluateCondition(user, filter)
    : evaluateGroup(user, filter);
};
