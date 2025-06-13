import { FilterExpression } from '../types';
import { doesUserMatchFilter, User } from './user';
import shortUUID from 'short-uuid';

const usuario: User = {
  nombre: 'Juan',
  correo: '',
  compañía: 'Servagro',
};

const filtro: FilterExpression = {
  id: shortUUID().generate(), // este campo es obligatorio según tu interface Group
  type: 'group',
  logic: 'AND',
  conditions: [
    {
      id: shortUUID().generate(),
      type: 'condition',
      field: 'nombre',
      operator: 'is defined',
    },
    {
      id: shortUUID().generate(),
      type: 'condition',
      field: 'correo',
      operator: 'is undefined',
    },
  ],
};

console.log(doesUserMatchFilter(usuario, filtro));
