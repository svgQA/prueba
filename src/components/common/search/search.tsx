import { useRef, useCallback, useMemo } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IFilterModel, ISearchProps } from './interface';
import { JSX } from 'preact';

export const Search = ({
  id,
  name,
  keys = [],
  lenThreshold = 3,
  placeholder,
}: ISearchProps) => {
  const inputState = useSignal<string>('');
  const searchArray = useSignal<IFilterModel[]>([]);
  const selectedKeyIndex = useSignal<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const keysContainerRef = useRef<HTMLDivElement>(null);

  const handleChangeInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
      if (event.target instanceof HTMLInputElement) {
        const { value } = event.target;
        inputState.value = value;
      }
    },
    []
  );

  const selectKey = useCallback(
    (selected: string) => {
      return (prev: IFilterModel[]) => {
        const existingIndex = prev.findIndex((item) => item.key === selected);
        if (existingIndex !== -1) {
          const updatedItem = {
            ...prev[existingIndex],
            value: [...prev[existingIndex].value, inputState.value.trim()],
          };
          return [
            ...prev.slice(0, existingIndex),
            updatedItem,
            ...prev.slice(existingIndex + 1),
          ];
        } else {
          return [...prev, { key: selected, value: [inputState.value.trim()] }];
        }
      };
    },
    [inputState.value]
  );

  const setFilterSelected = useCallback(
    (key: string) => {
      const setSearch = selectKey(key);
      searchArray.value = setSearch(searchArray.value);
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
        searchArray.value = searchArray.value.slice(0, -1);
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
    (event: JSX.TargetedMouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLSpanElement) {
        const name = target.getAttribute('name');
        if (name && name.startsWith('filter-delete-')) {
          const key = name.split('-')[2];
          if (!key) return;
          searchArray.value = searchArray.value.filter(
            (item) => item.key !== key
          );
        }
      }
    },
    []
  );

  const handleClickKeys = useCallback(
    (event: JSX.TargetedMouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const name = target.getAttribute('name');
      if (name && name.startsWith('filter-key-')) {
        const key = name.split('-')[2];
        if (!key) return;
        setFilterSelected(key);
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
        const keyName = `filter-key-${key}`;
        return (
          <div
            className={`px-2 py-0.5 cursor-pointer flex flex-row min-w-40 ${
              index === selectedKeyIndex.value ? 'bg-primary' : ''
            }`}
            name={keyName}
            key={keyName}
            tabIndex={index}
          >
            <span
              name={keyName}
              className='px-2 mr-1 min-w-8/12 rounded-md font-bold'
            >
              {key}:
            </span>
            {inputState.value}
          </div>
        );
      }),
    [keys, selectedKeyIndex.value, inputState.value]
  );

  const searchList = useMemo(
    () =>
      searchArray.value.map((item) => {
        const keyName = `filter-search-${item.key}`;
        return (
          <div
            key={keyName}
            name={keyName}
            className='mx-1 pr-2 flex flex-row justify-center relative items-center overflow-hidden whitespace-nowrap border rounded-md border-b-light-dark dark:border-b-dark-light'
          >
            <span className='content-center h-full px-1 mr-1 bg-primary text-sm font-bold min-w-[30px] truncate'>
              {item.key}
            </span>
            <p className='pr-1 truncate'>{item.value.join('|')}</p>
            <span
              name={`filter-delete-${item.key}`}
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
      className='max-w-[100%] flex flex-row items-center border-2 rounded-sm relative border-b-light-dark dark:border-b-dark-light bg-transparent'
    >
      <span className='px-2 vox-icon vx-icon-153' />
      <div
        name='input-filter-chips'
        className='flex flex-row max-w-[80%] overflow-auto'
        onClick={handleClickFilters}
      >
        {searchList}
      </div>
      <div className='relative rounded flex items-center w-full min-w-60 max-w-[20em]'>
        <input
          ref={inputRef}
          className='w-full rounded pl-2 capitalize'
          placeholder={placeholder}
          onChange={handleChangeInput}
          onKeyDown={handleKeyPress}
          value={inputState.value}
        />
      </div>
      <div
        ref={keysContainerRef}
        className={`${inputState.value.length > lenThreshold ? 'visible' : 'invisible'} absolute right-0 top-10 min-w-48 border-2 py-2 z-30 bg-b-light dark:bg-b-dark border-b-light-dark dark:border-b-dark-light`}
        onClick={handleClickKeys}
      >
        {keysList}
      </div>
    </div>
  );
};
