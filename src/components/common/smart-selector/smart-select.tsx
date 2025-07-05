import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useField } from 'react-final-form';
import { createPortal } from 'preact/compat';
import { FieldMetaState } from 'react-final-form';
import { Chip } from '../chip/chip';
import { useTranslation } from 'react-i18next';

export interface IOption {
  label: string;
  value: string | number;
}

const ALL_OPTION: IOption = {
  label: 'Todos',
  value: 0,
};

interface SmartSelectorProps<T = IOption> {
  name: string;
  options: IOption[];
  multiple?: boolean;
  allowAll?: boolean;
  placeholder?: string;
  menuPortalTarget?: HTMLElement | null;
  value?: IOption[] | IOption | string;
  onChange?: (value?: T) => void;
  meta?: FieldMetaState<any>;
  label?: string;
  id?: string;
  disabled?: boolean;
  icon?: string;
  end?: boolean;
  borderless?: boolean;
}

export function SmartSelector<T = IOption>({
  name,
  options,
  multiple = false,
  allowAll = false,
  placeholder = 'Buscar...',
  menuPortalTarget = null,
  label,
  id,
  onChange,
  disabled = false,
  meta,
  icon,
  end = false,
  borderless = false,
}: SmartSelectorProps<T>) {
  const { t } = useTranslation();
  const { input } = useField<IOption[] | IOption | string>(name);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const selected: IOption[] = useMemo(() => {
    if (Array.isArray(input.value)) return input.value;
    if (input.value && typeof input.value === 'object')
      return [input.value as IOption];
    return [];
  }, [input.value]);

  /*
  const filtered = useMemo(() => {
    if (search.length < 1) return [];
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) &&
        !selected.some((sel) => sel.value === opt.value)
    );
  }, [search, options, selected]);
  */

  const filtered = useMemo(() => {
    if (!focused) return [];
    if (search.length < 1)
      return options.filter(
        (opt) => !selected.some((sel) => sel.value === opt.value)
      );
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) &&
        !selected.some((sel) => sel.value === opt.value)
    );
  }, [search, options, selected, focused]);

  const handleSelect = (option: IOption) => {
    if (option.value === ALL_OPTION.value) {
      input.onChange([ALL_OPTION]);
      onChange?.(option as T);
    } else if (multiple) {
      const isAllSelected =
        selected.length === 1 && selected[0].value === ALL_OPTION.value;
      const alreadySelected = selected.some(
        (sel) => sel.value === option.value
      );
      const newSelection = isAllSelected
        ? [option]
        : alreadySelected
          ? selected
          : [...selected, option];
      input.onChange(newSelection);
      onChange?.(newSelection as T);
    } else {
      input.onChange(option);
      onChange?.(option as T);
    }

    setSearch('');
    setSelectedIndex(0);
    setFocused(false);
  };

  const handleRemove = (option: IOption) => {
    if (option.value === ALL_OPTION.value) {
      input.onChange([]);
      onChange?.();
    } else {
      const updated = selected.filter((sel) => sel.value !== option.value);
      input.onChange(updated);
      if (updated.length === 0) onChange?.();
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!focused || (search.length < 1 && !allowAll)) return;

    if (e.key === 'ArrowDown' || e.key === 'Tab') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (
        filtered.length > 0 &&
        selectedIndex >= 0 &&
        selectedIndex < filtered.length
      ) {
        handleSelect(filtered[selectedIndex]);
      }
    }

    if (e.key === 'Escape') {
      setFocused(false);
      setSearch(''); // Limpiar búsqueda al presionar Escape
    }
  };

  useEffect(() => {
    const inputEl = inputRef.current;
    inputEl?.addEventListener('keydown', handleKeyDown);
    return () => inputEl?.removeEventListener('keydown', handleKeyDown);
  }, [filtered, selectedIndex, focused]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered, search]);

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (focused) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [focused]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdown = (
    <div
      class='absolute bg-white dark:bg-b-dark-dark border border-gray-200 dark:border-gray-700 rounded shadow-md z-50 max-h-60 overflow-auto vox-scroll-design'
      style={{
        top: dropdownPos.top + 5,
        left: dropdownPos.left,
        width: dropdownPos.width,
        position: 'absolute',
      }}
    >
      {allowAll && search.toLowerCase() === 'todos' && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            handleSelect(ALL_OPTION);
          }}
          class='px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
        >
          <strong>Todos</strong>
        </div>
      )}
      {filtered.map((opt, idx) => (
        <div
          key={opt.value}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleSelect(opt);
          }}
          class={`px-4 py-2 cursor-pointer flex items-center
            transition-colors duration-200 border-none
            ${
              idx === selectedIndex
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={wrapperRef} class='relative w-full'>
      {label && (
        <label
          htmlFor={`${id}-input`}
          className='capitalize block text-sm font-medium'
        >
          {t(label)}
        </label>
      )}

      {multiple && (
        <div class='flex flex-wrap gap-2 mb-2'>
          {selected.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              onDelete={() => handleRemove(opt)}
              width='lg'
            />
          ))}
        </div>
      )}

      <div
        className={`
        ${borderless ? '' : 'border border-gray-200 dark:border-gray-700'}
        rounded-lg flex flex-row items-center w-full
        bg-white dark:bg-b-dark-dark
      `}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}
        <div className='relative flex-1 py-0.5'>
          <input
            ref={inputRef}
            type='text'
            name={name}
            id={`${id}-input`}
            value={search}
            placeholder={placeholder ? t(placeholder) : ''}
            disabled={disabled}
            onInput={(e) => {
              const value = (e.currentTarget as HTMLInputElement).value;
              setSearch(value);
              if (value.length > 0) {
                setFocused(true);
              }
            }}
            autoComplete='off'
            onFocus={() => !disabled && setFocused(true)}
            // focus:ring-blue-500 dark:focus:ring-blue-400
            className={`w-full px-3 py-2
            !bg-white dark:!bg-b-dark-dark
            text-gray-700 dark:text-gray-200
            border-gray-300 dark:border-gray-700
            appearance-none
            ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
            ${meta?.touched && meta?.error ? 'border-red-500 focus:ring-red-500' : ''}
            ${!multiple && selected.length > 0 ? 'pr-24' : ''}
          `}
          />
          {!multiple && selected.length > 0 && (
            <div className='absolute top-1/2 -translate-y-1/2 w-full'>
              <div className='relative  !bg-white dark:!bg-b-dark-dark flex items-center rounded-full py-0 px-2 text-center text-sm transition-all max-w-full h-6 justify-between'>
                <span className='truncate'>{selected[0].label}</span>
                <span
                  className='right-3 vox-icon vx-icon-192 cursor-pointer size-sm pl-3 flex-shrink-0'
                  onClick={() => handleRemove(selected[0])}
                />
              </div>
            </div>
          )}
        </div>
        {end && icon && <span className={`vox-icon vx-icon-${icon} px-2`} />}
      </div>

      {meta && meta.touched && meta.error && (
        <div class='text-sm text-red-600 mt-1'>{meta.error}</div>
      )}
      {/*
      {focused &&
        search.length >= 1 &&
        filtered.length > 0 &&
        createPortal(dropdown, menuPortalTarget ?? document.body)}
      */}
      {focused &&
        filtered.length > 0 &&
        createPortal(dropdown, menuPortalTarget ?? document.body)}
    </div>
  );
}
