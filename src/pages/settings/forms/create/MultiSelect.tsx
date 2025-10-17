import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface MultiSelectProps<T> {
  options: T[];
  selectedIds: (string | number)[];
  onChange: (selectedIds: (string | number)[]) => void;
  getLabel: (item: T) => string;
  getId: (item: T) => string | number;
  placeholder?: string;
}

export function MultiSelect<T>({
  options,
  selectedIds,
  onChange,
  getLabel,
  getId,
  placeholder = 'p_select',
}: MultiSelectProps<T>) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSelected = (item: T): boolean => selectedIds.includes(getId(item));

  const toggleOption = (item: T): void => {
    const id = getId(item);
    if (isSelected(item)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
    setSearch('');
    inputRef.current?.focus();
  };

  const removeOption = (idToRemove: string | number): void => {
    onChange(selectedIds.filter((id) => id !== idToRemove));
  };

  const selectedItems = options.filter((item) =>
    selectedIds.includes(getId(item))
  );

  const filteredOptions = options.filter(
    (opt) =>
      !selectedIds.includes(getId(opt)) &&
      getLabel(opt).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className='relative w-full'>
      <div
        className='min-h-[40px] px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-row items-center w-full
        bg-white dark:bg-b-dark-dark flex-wrap gap-1'
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selectedItems.map((item) => (
          <span
            key={getId(item)}
            className='flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full'
          >
            {getLabel(item)}
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                removeOption(getId(item));
              }}
              className='ml-1 text-blue-500 hover:text-blue-700 border-none text-sm'
            >
              ✕
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type='text'
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder={selectedItems.length === 0 ? t(placeholder) : ''}
          className='w-full px-3 bg-white dark:bg-b-dark-dark text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 appearance-none'
        />
      </div>

      {isOpen && (
        <ul className='absolute z-10 mt-1 w-full border bg-white dark:bg-b-dark-dark border-gray-200 dark:border-gray-700 rounded-md shadow-md max-h-60 overflow-y-auto'>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item) => (
              <li
                key={getId(item)}
                onClick={() => toggleOption(item)}
                className='px-4 py-2 text-sm cursor-pointer'
              >
                {getLabel(item)}
              </li>
            ))
          ) : (
            <li className='px-4 py-2 text-sm italic'>{t('no_results')}</li>
          )}
        </ul>
      )}
    </div>
  );
}
