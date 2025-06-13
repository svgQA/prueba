export type Operator =
  | '='
  | '!='
  | 'is defined'
  | 'is undefined'
  | 'like'
  | 'starts with';
export type Field =
  | 'nombre'
  | 'cognito'
  | 'address'
  | 'correo'
  | 'alias'
  | 'telefono'
  | 'canal'
  | 'roles'
  | 'perfil'
  | 'compañía'
  | 'departamento'
  | 'puesto';

export interface Condition {
  id: string;
  type: 'condition';
  field: Field;
  operator: Operator;
  value?: string;
}

export interface Group {
  id: string;
  type: 'group';
  logic: 'AND' | 'OR';
  conditions: FilterExpression[];
}

export type FilterExpression = Condition | Group;
