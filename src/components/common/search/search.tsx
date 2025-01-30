import { useRef, useCallback, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IKey, ISearchProps } from './interface';
import { TargetedEvent } from 'preact/compat';
import { ColumnFiltersState } from '@tanstack/react-table';

export const Search = ({
  id,
  name,
  keys = [],
  lenThreshold = 3,
  placeholder,
  value = [],
  onChange,
}: ISearchProps) => {
  const inputState = useSignal<string>('');
  const searchArray = useSignal<ColumnFiltersState>(value);
  const selectedKeyIndex = useSignal<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const keysContainerRef = useRef<HTMLDivElement>(null);

  const handleChangeInput = useCallback(
    (event: TargetedEvent<HTMLInputElement, Event>) => {
      if (event.target instanceof HTMLInputElement) {
        const { value } = event.target;
        inputState.value = value;
      }
    },
    []
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
            value /*: [...prev[existingIndex].value, value],*/,
          };
          return [
            ...prev.slice(0, existingIndex),
            updatedItem,
            ...prev.slice(existingIndex + 1),
          ];
        } else {
          return [...prev, { id, value /*: [value] */ }];
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
    },
    [selectKey]
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
      }
    },
    [inputState.value, selectedKeyIndex.value, keys, setFilterSelected]
  );

  const handleClickFilters = useCallback(
    (event: TargetedEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLSpanElement) {
        const name = target.getAttribute('name');
        if (name && name.startsWith('filter-delete-')) {
          const key = name.split('-')[2];
          if (!key) return;
          setFilter(searchArray.value.filter((item) => item.id !== key));
        }
      }
    },
    []
  );

  const handleClickKeys = useCallback(
    (event: TargetedEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const name = target.getAttribute('name');
      if (name && name.startsWith('filter-key-')) {
        const id = target.getAttribute('data-id');
        const label = target.getAttribute('data-label');
        if (!id || !label) return;
        setFilterSelected({ id, label });
        if (inputRef.current) {
          inputRef.current.focus();
        }
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
            className={`px-2 py-0.5 cursor-pointer flex flex-row min-w-40 hover:bg-primary hover:text-t-dark capitalize ${
              index === selectedKeyIndex.value ? 'bg-primary' : ''
            }`}
            key={keyName}
            name={keyName}
            data-id={key.id}
            data-label={key.label}
            tabIndex={index}
          >
            <span className='px-2 mr-1 min-w-8/12 rounded-md font-bold'>
              {key.label}:
            </span>
            {inputState.value}
          </div>
        );
      }),
    [keys, selectedKeyIndex.value, inputState.value]
  );

  const searchList = useMemo(
    () =>
      searchArray.value.map((item, index) => {
        const keyName = `filter-search-${item.id}-${index}`;
        return (
          <div
            key={keyName}
            name={keyName}
            className='mx-1 pr-2 flex flex-row justify-center relative items-center overflow-hidden whitespace-nowrap border rounded-md border-b-light-dark dark:border-b-dark-light'
          >
            <span className='content-center h-full px-1 mr-1 bg-primary text-sm font-bold min-w-[30px] truncate'>
              {item.id}
            </span>
            <p className='pr-1 truncate'>
              {String(item.value) /* .join('|') */}
            </p>
            <span
              name={`filter-delete-${item.id}`}
              className='absolute vox-icon vx-icon-192 size-sm right-0'
            />
          </div>
        );
      }),
    [searchArray.value]
  );

  return (
    <div
      id={id}
      name={name}
      className='w-2/3 h-16 flex flex-row items-center border rounded-sm relative border-b-light-dark dark:border-b-dark-light bg-transparent'
    >
      <span className='px-2 vox-icon vx-icon-153 ' />
      <div
        name='input-filter-chips'
        className='flex flex-row max-w-[80%] overflow-auto'
        onClick={handleClickFilters}
      >
        {searchList}
      </div>
      <div className='relative w-10/12 rounded flex items-center'>
        <input
          ref={inputRef}
          className='w-full rounded pl-2 capitalize bg-red-300'
          placeholder={placeholder}
          onChange={handleChangeInput}
          onKeyDown={handleKeyPress}
          value={inputState.value}
        />
      </div>
      {keys.length > 0 && (
        <div
          ref={keysContainerRef}
          className={`${inputState.value.length > lenThreshold ? 'visible' : 'invisible'} absolute right-0 top-10 min-w-48 border py-2 z-30 bg-b-light dark:bg-b-dark border-b-light-dark dark:border-b-dark-light`}
          onClick={handleClickKeys}
        >
          {keysList}
        </div>
      )}
    </div>
  );
};
