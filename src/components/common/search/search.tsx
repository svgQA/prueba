import { useRef, useCallback, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IKey, ISearchProps } from './interface';
import { TargetedEvent } from 'preact/compat';
import { ColumnFiltersState } from '@tanstack/react-table';

export const Search = ({
  id,
  keys = [],
  lenThreshold = 0,
  placeholder,
  value = [],
  onChange,
  table,
  group,
  grouping,
}: ISearchProps) => {
  const inputState = useSignal<string>('');
  const searchArray = useSignal<ColumnFiltersState>(value);
  const selectedKeyIndex = useSignal<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const keysContainerRef = useRef<HTMLDivElement>(null);
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
            value: [...(prev[existingIndex].value as string[]), value],
          };
          return [
            ...prev.slice(0, existingIndex),
            updatedItem,
            ...prev.slice(existingIndex + 1),
          ];
        } else {
          return [...prev, { id, value: [value] }];
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
      if (isDropdownOpen.value && keys.length > 0) {
        if (event.key === 'Enter' && inputState.value.trim() !== '') {
          event.preventDefault();
          const key =
            selectedKeyIndex.value !== -1
              ? keys[selectedKeyIndex.value]
              : keys[0];
          if (!key) return;
          setFilterSelected(key);
        } else if (event.key === 'Tab') {
          event.preventDefault();
          if (selectedKeyIndex.value === -1) {
            selectedKeyIndex.value = 0;
          } else {
            selectedKeyIndex.value = (selectedKeyIndex.value + 1) % keys.length;
          }
          if (keysContainerRef.current) {
            const selectedElement = keysContainerRef.current.children[
              selectedKeyIndex.value + 1
            ] as HTMLElement;
            if (selectedElement) {
              selectedElement.focus();
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          selectedKeyIndex.value =
            selectedKeyIndex.value === -1
              ? 0
              : (selectedKeyIndex.value + 1) % keys.length;
          if (keysContainerRef.current) {
            const selectedElement = keysContainerRef.current.children[
              selectedKeyIndex.value + 1
            ] as HTMLElement;
            if (selectedElement) {
              selectedElement.focus();
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          selectedKeyIndex.value =
            selectedKeyIndex.value === -1
              ? keys.length - 1
              : (selectedKeyIndex.value - 1 + keys.length) % keys.length;
          if (keysContainerRef.current) {
            const selectedElement = keysContainerRef.current.children[
              selectedKeyIndex.value + 1
            ] as HTMLElement;
            if (selectedElement) {
              selectedElement.focus();
              selectedElement.scrollIntoView({ block: 'nearest' });
            }
          }
        }
      } else if (event.key === 'Backspace' && inputState.value === '') {
        setFilter(searchArray.value.slice(0, -1));
      } else if (event.key === 'Escape') {
        isDropdownOpen.value = false;
        selectedKeyIndex.value = -1;
      }
    },
    [
      inputState.value,
      keys,
      setFilterSelected,
      searchArray,
      isDropdownOpen.value,
    ]
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

  const keysList = useMemo(
    () =>
      keys.map((key, index) => {
        const keyName = `filter-key-${key.id}-${index}`;
        return (
          <div
            className={`px-3 py-2 cursor-pointer flex flex-row min-w-40 rounded-md transition-colors duration-150 ${
              index === selectedKeyIndex.value
                ? 'bg-primary-opacity text-primary'
                : 'hover:bg-b-light hover:text-primary'
            }`}
            key={keyName}
            data-name={keyName}
            data-id={key.id}
            data-label={key.label}
            tabIndex={0}
            onKeyDown={handleKeyPress}
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
    [
      keys,
      selectedKeyIndex.value,
      inputState.value,
      setFilterSelected,
      handleKeyPress,
    ]
  );

  const searchList = useMemo(
    () =>
      searchArray.value.map((item, index) => {
        const keyName = `filter-search-${item.id}-${index}`;
        const key = keys.find((k) => k.id === item.id);
        const keyLabel = key?.label || item.id;

        return (
          <div key={keyName} className='relative'>
            <div
              data-name={keyName}
              className='flex items-center h-7 px-2 py-1 bg-primary-opacity text-primary rounded-xl cursor-pointer gap-1 transition-all hover:bg-primary-opacity-2 text-sm'
            >
              <span className='font-medium'>
                {keyLabel}: {String(item.value)}
              </span>
              <span
                className='ml-1 text-primary hover:text-ternary cursor-pointer flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-opacity-2'
                onClick={(e) => {
                  e.stopPropagation();
                  setFilter(searchArray.value.filter((f) => f.id !== item.id));
                }}
              >
                ×
              </span>
            </div>
          </div>
        );
      }),
    [searchArray.value, keys]
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
      className='flex flex-row items-center h-12 w-full max-w-[850px] px-3 border rounded-xl relative dark:border-b-dark-light border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-primary-opacity focus-within:border-primary transition-all duration-200'
    >
      <span className='vox-icon vx-icon-153 text-t-light-dark' />
      <div
        className='flex flex-row items-center gap-1 ml-2 flex-wrap'
        onClick={handleClickFilters}
      >
        {searchList}
      </div>
      <div className='flex-1 flex items-center'>
        <input
          ref={inputRef}
          className='w-full px-2 py-1 bg-transparent outline-none text-t-light placeholder-gray-400 text-base'
          placeholder={placeholder || 'Buscar por columna...'}
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

      {table && <div className='h-6 w-px bg-b-light-dark mx-2' />}

      {(table || grouping) && group && <>{group}</>}

      {keys.length > 0 && isDropdownOpen.value && (
        <div
          ref={keysContainerRef}
          className='absolute right-0 top-full mt-2 min-w-56 border py-2 z-30 bg-b-content rounded-xl shadow-md border-b-light-dark animate-in fade-in slide-in-from-top-5 duration-150 max-h-[300px] overflow-y-auto vox-scroll-design'
          onClick={handleClickKeys}
        >
          <h6 className='px-3 py-1 text-xs text-gray-500 font-medium uppercase'>
            Filtrar por
          </h6>
          {keysList}
        </div>
      )}
    </div>
  );
};
