import { FunctionComponent } from 'preact';
import { FieldRenderProps } from 'react-final-form';
import { IOption } from '../smart-selector/smart-select';
import { Input } from '../input/input';
import { useState, useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

interface IScheduleSelectorProps {
  name: string;
  value?: IOption[];
  onChange?: (value: IOption[]) => void;
  onBlur?: (event?: any) => void;
  onFocus?: (event?: any) => void;
  meta?: FieldRenderProps<any>['meta'];
  options: IOption[];
  label?: string;
  id?: string;
  error?: string;
  warning?: string;
}

export const ScheduleSelector: FunctionComponent<IScheduleSelectorProps> = ({
  name,
  value = [],
  onChange,
  onBlur,
  onFocus,
  options,
  label,
  id,
  meta,
  error,
  warning,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedValues, setSelectedValues] = useState<IOption[]>([]);

  // Actualizar selectedValues cuando cambie value
  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(value);
    }
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (optionValue: string | number) => {
    return selectedValues.some(
      (val) => String(val.value) === String(optionValue)
    );
  };

  const handleChange = (option: IOption, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, option]
      : selectedValues.filter(
          (val) => String(val.value) !== String(option.value)
        );

    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className='w-full'>
      {label && (
        <label
          for={`${id}-input`}
          className='capitalize block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          {label}
        </label>
      )}
      <div className='rounded-lg shadow-sm p-3 py-5 bg-b-light-light dark:bg-b-dark-light w-full'>
        <Input
          name='search_scheduler'
          type='text'
          value={search}
          icon='123'
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
          placeholder='p_search_scheduler'
        />

        {filteredOptions && filteredOptions.length > 0 && (
          <div className='max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-b-dark-dark p-4 vox-scroll-design mt-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
              {filteredOptions.map((option) => {
                const selected = isSelected(option.value);
                return (
                  <label
                    key={option.value}
                    className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors duration-200
                    ${
                      selected
                        ? 'bg-primary/10 dark:bg-primary/20 border-primary dark:border-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b-light-light dark:border-b-dark-light bg-b-light-light dark:bg-b-dark-light'
                    }
                    border-2 h-full`}
                  >
                    <input
                      type='checkbox'
                      name={name}
                      className='sr-only'
                      checked={selected}
                      onChange={(e) =>
                        handleChange(option, e.currentTarget.checked)
                      }
                      onBlur={onBlur}
                      onFocus={onFocus}
                    />
                    <div className='ml-3 flex-1 min-w-0'>
                      <div className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                        {option.label}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {meta && meta.touched && meta.error && (
        <span className='text-red-500 text-sm'>{t(meta.error)}</span>
      )}
      {error && <span className='text-red-500 text-sm'>{t(error)}</span>}
      {warning && <span className='text-yellow-500 text-sm'>{t(warning)}</span>}
    </div>
  );
};
