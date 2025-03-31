import { ComponentType } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { IUserResponse } from '@/types/auth';
import { IOption } from '@/components/common/multi/interface';
import { FieldMetaState } from 'react-final-form';

interface UserSelectorProps {
  value: IOption[];
  onChange: (value: IOption[]) => void;
  label?: string;
  placeholder?: string;
  meta?: FieldMetaState<IOption[]>;
  name: string;
  users: IUserResponse[];
}

export const UserSelector: ComponentType<UserSelectorProps> = ({
  value = [],
  onChange,
  label = 'Seleccionar Usuarios',
  placeholder = 'Buscar usuarios...',
  meta,
  name,
  users,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users
        .filter((user) =>
          `${user.name} ${user.surname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .map((user) => ({
          label: `${user.name} ${user.surname}`,
          value: Number(user.id),
        }));
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [searchTerm, users]);

  const handleSelect = (option: IOption) => {
    const optionValue = Number(option.value);
    const isSelected = value.some((v) => Number(v.value) === optionValue);

    if (isSelected) {
      onChange(value.filter((v) => Number(v.value) !== optionValue));
    } else {
      onChange([...value, { ...option, value: optionValue }]);
    }
    setSearchTerm('');
    setFilteredOptions([]);
    setShowDropdown(false);
  };

  const handleSelectAll = () => {
    if (value.length === users.length) {
      onChange([]);
    } else {
      onChange([
        {
          label: 'Todos',
          value: -1, // Usamos -1 como valor especial para indicar "todos"
        },
      ]);
    }
    setShowDropdown(false);
  };

  const handleRemoveUser = (optionToRemove: IOption) => {
    const removeValue = Number(optionToRemove.value);
    const newValue = value.filter(
      (v) => Number(v.value) !== Number(removeValue)
    );
    onChange(newValue);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función auxiliar para determinar si todos están seleccionados
  const isAllSelected = value.length === 1 && value[0]?.value === -1;

  return (
    <div className='relative' ref={dropdownRef}>
      <div className='mb-2'>
        <label className='block text-sm font-medium text-gray-700'>
          {label}
        </label>

        {value.length > 0 && (
          <div className='flex flex-wrap gap-1 mb-2'>
            {isAllSelected ? (
              <span className='inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800'>
                Todos
                <button
                  type='button'
                  className='ml-1 text-blue-600 hover:text-blue-800 border-none'
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                >
                  ×
                </button>
              </span>
            ) : (
              value.map((option) => (
                <span
                  key={option.value}
                  className='inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800'
                >
                  {option.label}
                  <button
                    type='button'
                    className='ml-1 text-blue-600 hover:text-blue-800 border-none'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUser(option);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        )}

        <div className='mt-1'>
          <Input
            type='text'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.currentTarget.value);
              setShowDropdown(true);
            }}
            placeholder={placeholder}
            name={name}
          />
        </div>
        {meta && meta.touched && meta.error && (
          <span className='text-red-500 text-sm'>{meta.error}</span>
        )}
      </div>

      {showDropdown && searchTerm && (
        <div className='absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto'>
          <div className='p-2 border-b border-gray-200'>
            <button
              type='button'
              className='w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded'
              onClick={handleSelectAll}
            >
              {value.length === users.length
                ? 'Deseleccionar todos'
                : 'Seleccionar todos'}
            </button>
          </div>

          {filteredOptions.length > 0 && (
            <div className='p-2'>
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  className={`w-full text-left px-2 py-1 text-sm rounded border-none ${
                    value.some((v) => Number(v.value) === Number(option.value))
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
