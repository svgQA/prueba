import { ComponentType } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Input } from '@/components/common/input/input';

interface Option {
  label: string;
  value: string | number;
}

interface SearchableSelectProps {
  value?: Option[];
  onChange: (value: Option[]) => void;
  label?: string;
  placeholder?: string;
  name: string;
  options: Option[];
  multiple?: boolean;
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  maxHeight?: string;
  meta: any;
}

export const SearchableSelect: ComponentType<SearchableSelectProps> = ({
  value = [],
  onChange,
  label,
  placeholder = 'Buscar...',
  name,
  options,
  multiple = false,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  maxHeight = 'max-h-60',
  meta,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [searchTerm, options]);

  const handleSelect = (option: Option) => {
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

  const handleRemoveOption = (optionToRemove: Option) => {
    if (!multiple) {
      onChange([]);
      return;
    }
    const newValue = value.filter((v) => v.value !== optionToRemove.value);
    onChange(newValue);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
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

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className='mb-2 relative'>
        {label && (
          <label className='block text-sm font-medium text-gray-700'>
            {label}
          </label>
        )}

        {value.length > 0 && (
          <div className='flex flex-wrap gap-1 mb-2'>
            {value.map((option) => (
              <span
                key={option.value}
                className='inline-flex items-center justify-between px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800'
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
            ))}
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
            onClick={() => setShowDropdown(true)}
            placeholder={placeholder}
            name={name}
            {...meta}
          />
        </div>
      </div>

      {showDropdown && (
        <div
          className={`absolute z-50 w-full max-w-80 bg-white rounded-md shadow-lg border border-gray-200 ${maxHeight} overflow-auto ${dropdownClassName} vox-scroll-design`}
          style={{
            top: '100%',
            left: 0,
            marginTop: '5px',
          }}
        >
          <div className='p-2'>
            {(searchTerm ? filteredOptions : options).map((option) => (
              <button
                key={option.value}
                type='button'
                className={`w-full text-left px-2 py-1 text-sm rounded border-none ${
                  value.some((v) => v.value === option.value)
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${optionClassName}`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
