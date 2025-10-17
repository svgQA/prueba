import { v4 as uuidv4 } from 'uuid';
import { Condition, Group } from './types';

export const createEmptyCondition = (): Condition => ({
  id: uuidv4(),
  type: 'condition',
  field: 'nombre',
  operator: '=',
  value: '',
});

export const createEmptyGroup = (): Group => ({
  id: uuidv4(),
  type: 'group',
  logic: 'AND',
  conditions: [],
});
