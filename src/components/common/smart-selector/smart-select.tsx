import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useField } from 'react-final-form';
import { createPortal } from 'preact/compat';
import { FieldMetaState } from 'react-final-form';
import { Chip } from '../chip/chip';

export interface IOption {
  label: string;
  value: string | number;
}

const ALL_OPTION: IOption = {
  label: 'Todos',
  value: 0,
};

interface SmartSelectorProps {
  name: string;
  options: IOption[];
  multiple?: boolean;
  allowAll?: boolean;
  placeholder?: string;
  menuPortalTarget?: HTMLElement | null;
  value?: IOption[] | IOption | string;
  onChange?: (value?: IOption) => void;
  meta?: FieldMetaState<any>;
  label?: string;
  id?: string;
  disabled?: boolean;
}

export function SmartSelector({
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
}: SmartSelectorProps) {
  const { input, meta } = useField<IOption[] | IOption | string>(name);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const selected: IOption[] = useMemo(() => {
    if (input.value === ALL_OPTION.value) return [ALL_OPTION];
    if (Array.isArray(input.value)) return input.value;
    return input.value ? [input.value as IOption] : [];
  }, [input.value]);

  const filtered = useMemo(() => {
    if (search.length < 1) return [];
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) &&
        !selected.some((sel) => sel.value === opt.value)
    );
  }, [search, options, selected]);

  const handleSelect = (option: IOption) => {
    if (option.value === ALL_OPTION.value) {
      input.onChange(ALL_OPTION.value);
    } else if (multiple) {
      const isAll =
        selected.length === 1 && selected[0].value === ALL_OPTION.value;
      const newSelection = isAll ? [option] : [...selected, option];
      input.onChange(newSelection);
    } else {
      input.onChange(option);
    }

    setSearch(''); // ✅ Limpiar búsqueda
    setSelectedIndex(0); // ✅ Reiniciar índice
    setFocused(false); // ✅ Cerrar el dropdown después de seleccionar
    onChange?.(option);
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
        <label for={`${id}-input`} class='block text-sm font-medium pb-1'>
          {label}
        </label>
      )}
      <div class='flex flex-wrap gap-2 mb-2'>
        {selected.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            onDelete={() => handleRemove(opt)}
          />
        ))}
      </div>

      <input
        ref={inputRef}
        type='text'
        name={name}
        id={`${id}-input`}
        value={search}
        placeholder={placeholder}
        disabled={disabled} // ✅ aquí
        onInput={(e) => setSearch((e.currentTarget as HTMLInputElement).value)}
        onFocus={() => !disabled && setFocused(true)} // ✅ evitar focus si está deshabilitado
        className={`w-full border px-3 py-2 rounded
        !bg-white dark:!bg-b-dark-dark
        text-gray-700 dark:text-gray-200
        border-gray-300 dark:border-gray-700
        focus:ring-blue-500 dark:focus:ring-blue-400
        appearance-none
        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
        ${meta?.touched && meta?.error ? 'border-red-500 focus:ring-red-500' : ''}
      `}
      />

      {meta && meta.touched && meta.error && (
        <div class='text-sm text-red-600 mt-1'>{meta.error}</div>
      )}
      {focused &&
        search.length >= 1 &&
        filtered.length > 0 &&
        createPortal(dropdown, menuPortalTarget ?? document.body)}
    </div>
  );
}
