import { ComponentType } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { IOption } from '@/components/common/multi/interface';
import { FieldMetaState } from 'react-final-form';
import { createPortal } from 'preact/compat';

export interface CustomSelectorProps {
  value?: IOption[];
  onChange: (value: IOption[]) => void;
  label?: string;
  placeholder?: string;
  meta?: FieldMetaState<IOption[]>;
  name: string;
  options: IOption[];
  multiple?: boolean;
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  showSelectAll?: boolean;
  maxHeight?: string;
  menuPortalTarget?: HTMLElement | null;
}

export const CustomSelector: ComponentType<CustomSelectorProps> = ({
  value = [],
  onChange,
  label,
  placeholder = 'Buscar...',
  meta,
  name,
  options,
  multiple = false,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  showSelectAll = true,
  maxHeight = 'max-h-60',
  menuPortalTarget,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownStyles, setDropdownStyles] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyles({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition();

      const handleScroll = (event: Event) => {
        const target = event.target as HTMLElement;
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updateDropdownPosition);

      return () => {
        document.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDropdown) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
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

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDropdown, filteredOptions, selectedIndex]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
      setSelectedIndex(0);
    } else {
      setFilteredOptions([]);
    }
  }, [searchTerm, options]);

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
      onChange([{ label: 'Todos', value: -1 }]);
    }
    setShowDropdown(false);
  };

  const handleRemoveOption = (optionToRemove: IOption) => {
    if (!multiple) {
      onChange([]);
      return;
    }
    const newValue = value.filter((v) => v.value !== optionToRemove.value);
    onChange(newValue);
  };

  const isAllSelected =
    multiple && value.length === 1 && value[0]?.value === -1;

  return (
    <div className={`relative ${className}`}>
      <div className='mb-2 relative'>
        {label && (
          <label className='block text-sm font-medium text-gray-700'>
            {label}
          </label>
        )}

        {value.length > 0 && (
          <div
            className={`flex flex-wrap gap-1 mb-2 ${!multiple ? 'absolute bottom-0 right-0 w-full' : ''}`}
          >
            {isAllSelected ? (
              <span className='inline-flex items-center justify-between px-2 py-1 rounded-md text-sm bg-teal-100 text-teal-800 w-full h-full'>
                Todos
                <button
                  type='button'
                  className='ml-1 text-teal-500 hover:text-teal-800 border-none'
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
                      handleRemoveOption(option);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        )}

        <div className='mt-1' ref={inputRef}>
          <Input
            type='text'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.currentTarget.value);
              setShowDropdown(true);
            }}
            // onClick={() => setShowDropdown(true)}
            placeholder={placeholder}
            name={name}
            {...meta}
          />
        </div>

        {meta?.touched && meta.error && (
          <span className='text-red-500 text-sm'>{meta.error}</span>
        )}
      </div>

      {showDropdown &&
        searchTerm &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: dropdownStyles.top,
              left: dropdownStyles.left - 1,
              width: dropdownStyles.width,
              zIndex: 9999,
            }}
            className={`bg-white rounded-md shadow-lg border border-gray-200 ${maxHeight} overflow-auto ${dropdownClassName} vox-scroll-design`}
          >
            {multiple && showSelectAll && (
              <div className='p-2 border-b border-gray-200'>
                <button
                  type='button'
                  className='w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded'
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectAll();
                  }}
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
                    } ${optionClassName}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(option);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>,
          menuPortalTarget || document.body
        )}
    </div>
  );
};
