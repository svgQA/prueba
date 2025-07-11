import { useEffect, useRef, useState } from 'react';

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
  placeholder = 'Seleccione...',
}: MultiSelectProps<T>) {
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
    <div ref={containerRef} className='relative w-full max-w-md'>
      <div
        className='min-h-[40px] px-3 py-2 bg-white border border-gray-300 rounded-md flex flex-wrap gap-1 items-center'
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
              className='ml-1 text-blue-500 hover:text-blue-700'
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
          placeholder={selectedItems.length === 0 ? placeholder : ''}
          className='flex-grow border-none focus:ring-0 outline-none text-sm text-gray-700 min-w-[100px]'
        />
      </div>

      {isOpen && (
        <ul className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto'>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item) => (
              <li
                key={getId(item)}
                onClick={() => toggleOption(item)}
                className='px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer'
              >
                {getLabel(item)}
              </li>
            ))
          ) : (
            <li className='px-4 py-2 text-sm text-gray-500 italic'>
              No hay resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
