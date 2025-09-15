import { ComponentType } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { IOption } from '@/components/common/multi/interface';
import { FieldMetaState } from 'react-final-form';
import { useTranslation } from 'react-i18next';

interface SearchableSelectProps {
  value?: IOption[];
  onChange: (value: IOption[]) => void;
  label?: string;
  placeholder?: string;
  meta?: FieldMetaState<IOption[]>;
  name: string;
  options: IOption[];
  multiple?: boolean;
}

export const SearchableSelect: ComponentType<SearchableSelectProps> = ({
  value = [],
  onChange,
  label,
  placeholder = 'p_search_users',
  meta,
  name,
  options,
  multiple = false,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
      setSelectedIndex(0); // Resetear el índice cuando se filtra
    } else {
      setFilteredOptions([]);
    }
  }, [searchTerm, options]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        break;
    }
  };

  const handleSelect = (option: IOption) => {
    if (multiple) {
      const isSelected = value.some((v) => v.value === option.value);
      if (isSelected) {
        onChange(value.filter((v) => v.value !== option.value));
      } else {
        onChange([...value, option]);
      }
    } else {
      onChange([option]);
      setShowDropdown(false);
    }
    setSearchTerm('');
    setFilteredOptions([]);
  };

  const handleSelectAll = () => {
    if (!multiple) return;

    if (value.length === options.length) {
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
    if (!multiple) {
      onChange([]);
      return;
    }
    const newValue = value.filter((v) => v.value !== optionToRemove.value);
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
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDropdown, filteredOptions, selectedIndex]);

  // Función auxiliar para determinar si todos están seleccionados
  const isAllSelected =
    multiple && value.length === 1 && value[0]?.value === -1;

  return (
    <div className='relative' ref={dropdownRef}>
      <div className='mb-2 relative'>
        <label className='block text-sm font-medium text-gray-700'>
          {t(label || '')}
        </label>

        {value.length > 0 && (
          <div
            className={`flex flex-wrap gap-1 mb-2 ${!multiple ? 'absolute bottom-0 right-0 w-full' : ''}`}
          >
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
                  className='inline-flex items-center justify-between px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800 w-full h-full'
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
            placeholder={t(placeholder)}
            name={name}
          />
        </div>
        {meta && meta.touched && meta.error && (
          <span className='text-red-500 text-sm'>{meta.error}</span>
        )}
      </div>

      {showDropdown && searchTerm && (
        <div className='absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto'>
          {multiple && (
            <div className='p-2 border-b border-gray-200'>
              <button
                type='button'
                className='w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded'
                onClick={handleSelectAll}
              >
                {value.length === options.length
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </button>
            </div>
          )}

          {filteredOptions.length > 0 && (
            <div className='p-2'>
              {filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type='button'
                  className={`w-full text-left px-2 py-1 text-sm rounded border-none ${
                    index === selectedIndex
                      ? 'bg-blue-100 text-blue-800'
                      : value.some((v) => v.value === option.value)
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
