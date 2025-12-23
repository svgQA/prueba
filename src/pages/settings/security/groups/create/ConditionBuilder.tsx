import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { Condition } from './utils/types';
import { useEffect } from 'preact/hooks';
import { CompanyService } from '@/services/general/company';
//import { useTranslation } from 'react-i18next';
import { RoleService } from '@/services/general/role';

interface Props {
  condition: Condition;
  onRemove: () => void;
  onChange: (updated: Condition) => void;
}

const operatorsWithValue = ['=', '!=', 'like', 'starts with'];
//const { t } = useTranslation();

const fieldOptions = [
  { label: 'Nombre', value: 'name' },
  { label: 'Cognito', value: 'cognito' },
  { label: 'Dirección', value: 'address' },
  { label: 'Correo', value: 'email' },
  { label: 'Alias', value: 'alias' },
  { label: 'Teléfono', value: 'phone' },
  { label: 'Canal', value: 'channel' },
  { label: 'Roles', value: 'roles' },
  { label: 'Perfil', value: 'profile' },
  { label: 'Compañía', value: 'company' },
  { label: 'Departamento', value: 'department' },
  { label: 'Puesto', value: 'position' },
];

const operatorOptions = [
  { label: '=', value: '=' },
  { label: '!=', value: '!=' },
  { label: 'like', value: 'like' },
  { label: 'starts with', value: 'starts with' },
  { label: 'is defined', value: 'is defined' },
  { label: 'is undefined', value: 'is undefined' },
];

const predefinedOptions: Record<string, { label: string; value: string }[]> = {
  company: [],
  roles: [],
  profile: [
    {
      value: 'USER',
      label: 'user.create.form.userType.USER',
    },
    {
      value: 'ADMIN',
      label: 'user.create.form.userType.ADMIN',
    },
    {
      value: 'CLIENT',
      label: 'user.create.form.userType.CLIENT',
    },
  ],
};

export const ConditionBuilder = ({ condition, onRemove, onChange }: Props) => {
  useEffect(() => {
    Promise.all([getCompanies(), getRoles()]);
  }, []);

  const getCompanies = async (): Promise<void> => {
    const response = await CompanyService.getCompanyList();
    if (!response.getStatus()) return;
    predefinedOptions.company = response.getMany().map((company) => ({
      label: company.label,
      value: company.label,
    }));
  };

  const getRoles = async (): Promise<void> => {
    const response = await RoleService.getRoles();
    if (!response.getStatus()) return;
    predefinedOptions.roles = response.getMany().map((role) => ({
      label: role.name,
      value: role.name,
    }));
  };

  return (
    <div className='flex gap-3 flex-row bg-gray-50 dark:bg-gray-700 px-3 items-center justify-between rounded-md'>
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
      <div className='w-full'>
        {operatorsWithValue.includes(condition.operator) &&
          (predefinedOptions[condition.field] ? (
            <Dropdown
              id={`value-${condition.id}`}
              name='value'
              value={condition.value ?? ''}
              options={predefinedOptions[condition.field]}
              onChange={(val) => onChange({ ...condition, value: String(val) })}
            />
          ) : (
            <Input
              name='int-selection'
              value={condition.value ?? ''}
              onChange={(e) =>
                onChange({
                  ...condition,
                  value: (e.currentTarget as HTMLInputElement).value,
                })
              }
            />
          ))}
      </div>
      <Button
        name='btn-remove-action'
        onClick={onRemove}
        icon='041'
        transparent
        borderless
        rounded={false}
      />
    </div>
  );
};
