import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { Condition } from './utils/types';

interface Props {
  condition: Condition;
  onRemove: () => void;
  onChange: (updated: Condition) => void;
}

const operatorsWithValue = ['=', '!=', 'like', 'starts with'];

const fieldOptions = [
  'nombre',
  'cognito',
  'address',
  'correo',
  'alias',
  'telefono',
  'canal',
  'roles',
  'perfil',
  'compañía',
  'departamento',
  'puesto',
].map((field) => ({ label: field, value: field }));

const operatorOptions = [
  { label: '=', value: '=' },
  { label: '!=', value: '!=' },
  { label: 'like', value: 'like' },
  { label: 'starts with', value: 'starts with' },
  { label: 'is defined', value: 'is defined' },
  { label: 'is undefined', value: 'is undefined' },
];

const predefinedOptions: Record<string, { label: string; value: string }[]> = {
  compañía: [
    { label: 'Servagro', value: 'Servagro' },
    { label: 'Inndico', value: 'Inndico' },
    { label: 'TechCorp', value: 'TechCorp' },
  ],
  roles: [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ],
  perfil: [
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Empleado', value: 'empleado' },
  ],
};

export const ConditionBuilder = ({ condition, onRemove, onChange }: Props) => {
  return (
    <div className='flex flex-wrap md:flex-nowrap gap-2 items-center bg-white dark:bg-b-dark-dark p-2 justify-center'>
      <div className='w-44'>
        <Dropdown
          id={`field-${condition.id}`}
          name='field'
          value={condition.field}
          options={fieldOptions}
          onChange={(val) =>
            onChange({ ...condition, field: String(val) as any })
          }
        />
      </div>
      <div className='w-44'>
        <Dropdown
          id={`operator-${condition.id}`}
          name='operator'
          value={condition.operator}
          options={operatorOptions}
          onChange={(val) =>
            onChange({ ...condition, operator: String(val) as any })
          }
        />
      </div>
      {operatorsWithValue.includes(condition.operator) &&
        (predefinedOptions[condition.field] ? (
          <div className='w-40'>
            <Dropdown
              id={`value-${condition.id}`}
              name='value'
              value={condition.value ?? ''}
              options={predefinedOptions[condition.field]}
              onChange={(val) => onChange({ ...condition, value: String(val) })}
            />
          </div>
        ) : (
          <div className='w-1/2'>
            <Input
              name='int-selection'
              paddingVertical='py-1'
              value={condition.value ?? ''}
              onChange={(e) =>
                onChange({
                  ...condition,
                  value: (e.currentTarget as HTMLInputElement).value,
                })
              }
            />
          </div>
        ))}
      <Button
        name='btn-remove-action'
        onClick={onRemove}
        icon='014'
        rounded={false}
      />
    </div>
  );
};
