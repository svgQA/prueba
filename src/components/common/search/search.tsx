import { useRef, useCallback, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IKey, ISearchProps } from './interface';
import { TargetedEvent } from 'preact/compat';
import { ColumnFiltersState } from '@tanstack/react-table';

export const Search = ({
  id,
  keys = [],
  lenThreshold = 3,
  placeholder,
  value = [],
  onChange,
  table,
  group,
}: ISearchProps) => {
  const inputState = useSignal<string>('');
  const searchArray = useSignal<ColumnFiltersState>(value);
  const selectedKeyIndex = useSignal<number>(-1);
  const activeFilterId = useSignal<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const keysContainerRef = useRef<HTMLDivElement>(null);
  const filterTimeoutRef = useRef<number | null>(null);
  const isIconHovered = useSignal<boolean>(false);
  const isDropdownOpen = useSignal<boolean>(false);

  const handleChangeInput = useCallback(
    (event: TargetedEvent<HTMLInputElement, Event>) => {
      if (event.target instanceof HTMLInputElement) {
        const { value } = event.target;
        inputState.value = value;

        if (value.length > lenThreshold) {
          isDropdownOpen.value = true;
        } else {
          isDropdownOpen.value = false;
        }
      }
    },
    [lenThreshold]
  );

  const setFilter = (filter: ColumnFiltersState) => {
    searchArray.value = filter;
    if (!onChange) return;
    onChange(searchArray.value);
  };

  const selectKey = useCallback(
    (selected: IKey) => {
      return (prev: ColumnFiltersState) => {
        const id = selected.id;
        const value = inputState.value.trim();
        const existingIndex = prev.findIndex((item) => item.id === id);
        if (existingIndex !== -1) {
          const updatedItem = {
            ...prev[existingIndex],
            value,
          };
          return [
            ...prev.slice(0, existingIndex),
            updatedItem,
            ...prev.slice(existingIndex + 1),
          ];
        } else {
          return [...prev, { id, value }];
        }
      };
    },
    [inputState.value]
  );

  const setFilterSelected = useCallback(
    (key: IKey) => {
      const setSearch = selectKey(key);
      setFilter(setSearch(searchArray.value));
      inputState.value = '';
      selectedKeyIndex.value = -1;
      isDropdownOpen.value = false;

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    },
    [searchArray, selectKey, inputState]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && inputState.value.trim() !== '') {
        const key =
          selectedKeyIndex.value !== -1
            ? keys[selectedKeyIndex.value]
            : keys[0];
        if (!key) return;
        setFilterSelected(key);
      } else if (event.key === 'Backspace' && inputState.value === '') {
        setFilter(searchArray.value.slice(0, -1));
      } else if (event.key === 'Tab') {
        event.preventDefault();
        if (selectedKeyIndex.value === -1) {
          selectedKeyIndex.value = 0;
        } else {
          selectedKeyIndex.value = (selectedKeyIndex.value + 1) % keys.length;
        }
        if (keysContainerRef.current) {
          keysContainerRef.current.focus();
        }
      } else if (event.key === 'ArrowDown' && selectedKeyIndex.value !== -1) {
        event.preventDefault();
        selectedKeyIndex.value = (selectedKeyIndex.value + 1) % keys.length;
      } else if (event.key === 'ArrowUp' && selectedKeyIndex.value !== -1) {
        event.preventDefault();
        selectedKeyIndex.value =
          (selectedKeyIndex.value - 1 + keys.length) % keys.length;
      } else if (event.key === 'Escape') {
        isDropdownOpen.value = false;
        selectedKeyIndex.value = -1;
      }
    },
    [inputState.value, keys, setFilterSelected, searchArray]
  );

  const handleClickFilters = useCallback(
    (event: TargetedEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLSpanElement) {
        const name = target.getAttribute('data-name');
        if (name && name.startsWith('filter-delete-')) {
          const key = name.split('-')[2];
          if (!key) return;
          setFilter(searchArray.value.filter((item) => item.id !== key));
        }
      }
    },
    [searchArray]
  );

  const handleClickKeys = useCallback(
    (event: TargetedEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const name = target.getAttribute('data-name');
      if (name && name.startsWith('filter-key-')) {
        const id = target.getAttribute('data-id');
        const label = target.getAttribute('data-label');
        if (!id || !label) return;
        setFilterSelected({ id, label });
      }
    },
    [setFilterSelected]
  );

  const showFilterDetails = useCallback((id: string) => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = null;
    }
    activeFilterId.value = id;
  }, []);

  const hideFilterDetails = useCallback(() => {
    filterTimeoutRef.current = window.setTimeout(() => {
      activeFilterId.value = null;
    }, 500);
  }, []);

  const keysList = useMemo(
    () =>
      keys.map((key, index) => {
        const keyName = `filter-key-${key.id}-${index}`;
        return (
          <div
            className={`px-3 py-2 cursor-pointer flex flex-row min-w-40 rounded-md transition-colors duration-150 ${
              index === selectedKeyIndex.value
                ? 'bg-[#E1F5FE] text-[#00BCD4]'
                : 'hover:bg-[#F5F9FA] hover:text-[#00BCD4]'
            }`}
            key={keyName}
            data-name={keyName}
            data-id={key.id}
            data-label={key.label}
            tabIndex={index}
            onClick={(e) => {
              e.stopPropagation();
              setFilterSelected(key);
            }}
          >
            <span className='px-2 mr-1 font-medium text-sm capitalize'>
              {key.label}:
            </span>
            <span className='text-sm font-normal'>{inputState.value}</span>
          </div>
        );
      }),
    [keys, selectedKeyIndex.value, inputState.value, setFilterSelected]
  );

  const searchList = useMemo(
    () =>
      searchArray.value.map((item, index) => {
        const keyName = `filter-search-${item.id}-${index}`;
        const key = keys.find((k) => k.id === item.id);
        const isActive = activeFilterId.value === item.id;

        return (
          <div
            key={keyName}
            className='relative'
            onMouseEnter={() => showFilterDetails(item.id)}
            onMouseLeave={hideFilterDetails}
          >
            <div
              data-name={keyName}
              className='flex items-center h-8 px-3 bg-[#00BCD4] text-white rounded-md cursor-pointer gap-1 transition-all hover:bg-[#00ACC1]'
            >
              <span className='font-medium text-sm'>{String(item.value)}</span>
              <span
                className='ml-1 text-white hover:text-red-100 cursor-pointer flex items-center justify-center w-5 h-5 rounded-full hover:bg-[#00ACC1]'
                onClick={(e) => {
                  e.stopPropagation();
                  setFilter(searchArray.value.filter((f) => f.id !== item.id));
                }}
              >
                ×
              </span>
            </div>
            {isActive && (
              <div className='absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-40 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-150'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium text-gray-800'>
                    {key?.label || item.id}
                  </span>
                  <span
                    data-name={`filter-delete-${item.id}`}
                    className='vox-icon vx-icon-192 size-sm cursor-pointer hover:text-red-500'
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter(
                        searchArray.value.filter((f) => f.id !== item.id)
                      );
                    }}
                  />
                </div>
                <div className='text-sm text-gray-600'>
                  Filtrado por:{' '}
                  <span className='font-medium'>{String(item.value)}</span>
                </div>
              </div>
            )}
          </div>
        );
      }),
    [
      searchArray.value,
      keys,
      activeFilterId.value,
      showFilterDetails,
      hideFilterDetails,
    ]
  );

  const handleClickOutside = (e: MouseEvent) => {
    if (
      isDropdownOpen.value &&
      keysContainerRef.current &&
      !keysContainerRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      isDropdownOpen.value = false;
      selectedKeyIndex.value = -1;
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }

  return (
    <div
      id={id}
      className='flex flex-row items-center h-12 max-w-[50%] px-3 border rounded-lg relative border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E1F5FE] focus-within:border-[#00BCD4] transition-all duration-200'
    >
      <span className='vox-icon vx-icon-153 text-gray-500' />
      <div
        className='flex flex-row items-center gap-2 ml-2 flex-wrap'
        onClick={handleClickFilters}
      >
        {searchList}
      </div>
      <div className='flex-1 flex items-center'>
        <input
          ref={inputRef}
          className='w-full px-2 bg-transparent outline-none text-gray-700 placeholder-gray-400'
          placeholder={placeholder}
          onChange={handleChangeInput}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            if (inputState.value.length > lenThreshold) {
              isDropdownOpen.value = true;
            }
          }}
          value={inputState.value}
        />
      </div>

      {table && <div className='h-5 w-px bg-gray-200 mx-2' />}

      {table && group && <>{group}</>}

      <div
        className='relative ml-2'
        onMouseEnter={() => (isIconHovered.value = true)}
        onMouseLeave={() => (isIconHovered.value = false)}
      >
        {searchArray.value.length > 0 && isIconHovered.value ? (
          <span
            className='vox-icon vx-icon-271 text-gray-500 cursor-pointer hover:text-red-500 transition-colors'
            onClick={() => setFilter([])}
            title='Limpiar filtros'
          />
        ) : (
          <span className='vox-icon vx-icon-270 text-gray-500 cursor-pointer' />
        )}
      </div>

      {keys.length > 0 && isDropdownOpen.value && (
        <div
          ref={keysContainerRef}
          className='absolute right-0 top-full mt-2 min-w-56 border py-2 z-30 bg-white rounded-lg shadow-md border-gray-100 animate-in fade-in slide-in-from-top-5 duration-150 max-h-[300px] overflow-y-auto'
          onClick={handleClickKeys}
        >
          <div className='px-3 py-1 text-xs text-gray-500 font-medium uppercase'>
            Filtrar por
          </div>
          {keysList}
        </div>
      )}
    </div>
  );
};
