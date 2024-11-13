import { useState, useRef } from 'preact/hooks';
import { IFilterModel, ISearchProps } from './interface';
import { JSX } from 'preact';

export const Search = ({
  id,
  name,
  keys = [],
  lenThreshold = 3,
  placeholder,
  // onChange = (_) => {},
}: ISearchProps) => {
  const [inputState, setInputState] = useState<string>('');
  const [searchArray, setSearchArray] = useState<IFilterModel[]>([]);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const keysContainerRef = useRef<HTMLDivElement>(null);

  const handleChangeInput = (
    event: JSX.TargetedEvent<HTMLInputElement, Event>
  ) => {
    if (event.target instanceof HTMLInputElement) {
      const { value } = event.target;
      setInputState(value);
    }
  };

  const setFilterSelected = (key: string) => {
    const setSearch = selectKey(key);
    setSearchArray((prev) => setSearch(prev));
    setInputState('');
    setSelectedKeyIndex(-1);
  };

  const selectKey = (selected: string) => {
    return (prev: IFilterModel[]) => {
      const existingIndex = prev.findIndex((item) => item.key === selected);
      if (existingIndex !== -1) {
        const updatedItem = {
          ...prev[existingIndex],
          value: [...prev[existingIndex].value, inputState.trim()],
        };
        return [
          ...prev.slice(0, existingIndex),
          updatedItem,
          ...prev.slice(existingIndex + 1),
        ];
      } else {
        return [...prev, { key: selected, value: [inputState.trim()] }];
      }
    };
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && inputState.trim() !== '') {
      const key = selectedKeyIndex !== -1 ? keys[selectedKeyIndex] : keys[0];
      if (!key) return;
      setFilterSelected(key);
    } else if (event.key === 'Backspace' && inputState === '') {
      setSearchArray((prev) => prev.slice(0, -1));
    } else if (event.key === 'Tab') {
      event.preventDefault();
      setSelectedKeyIndex(0);
      if (keysContainerRef.current) {
        keysContainerRef.current.focus();
      }
    } else if (event.key === 'ArrowDown' && selectedKeyIndex !== -1) {
      event.preventDefault();
      setSelectedKeyIndex((prev) => (prev + 1) % keys.length);
    } else if (event.key === 'ArrowUp' && selectedKeyIndex !== -1) {
      event.preventDefault();
      setSelectedKeyIndex((prev) => (prev - 1 + keys.length) % keys.length);
    }
  };

  const handleClickFilters = (
    event: JSX.TargetedMouseEvent<HTMLDivElement>
  ) => {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLSpanElement) {
      const name = target.getAttribute('name');
      if (name && name.startsWith('filter-delete-')) {
        const key = name.split('-')[2];
        if (!key) return;
        setSearchArray((prev) => prev.filter((item) => item.key !== key));
      }
    }
  };

  const handleClickKeys = (event: JSX.TargetedMouseEvent<HTMLDivElement>) => {
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
  };

  return (
    <div
      id={id}
      name={name}
      className='flex flex-row items-center border-2 rounded-sm relative w-full border-b-light-dark dark:border-b-dark-light bg-transparent'
    >
      <span className='px-2 vox-icon vx-icon-153' />
      <div
        name='input-filter-chips'
        className='flex flex-row'
        onClick={handleClickFilters}
      >
        {searchArray.map((item) => {
          const keyName = `filter-search-${item.key}`;
          return (
            <div
              key={keyName}
              name={keyName}
              className='rounded mx-1 pr-2 flex flex-row justify-center relative'
            >
              <span className='px-1 mr-1'>{item.key}</span>
              <span className='pr-2'>{item.value.join(' | ')}</span>
              <span
                name={`filter-delete-${item.key}`}
                className='absolute top-0 right-0.5 cursor-pointer px-0.5 font-extralight text-xs'
              >
                x
              </span>
            </div>
          );
        })}
      </div>
      <div className='relative rounded flex items-center w-full'>
        <input
          ref={inputRef}
          className='w-full p-2 rounded pl-10 capitalize'
          placeholder={placeholder}
          onChange={handleChangeInput}
          onKeyDown={handleKeyPress}
          value={inputState}
        />
      </div>
      <div
        ref={keysContainerRef}
        className={`${inputState.length > lenThreshold ? 'visible' : 'invisible'} absolute right-0 top-10 min-w-48 border-2 py-2 z-30`}
        onClick={handleClickKeys}
      >
        {keys.map((key, index) => {
          const keyName = `filter-key-${key}`;
          return (
            <div
              className={`px-2 py-0.5 cursor-pointer flex flex-row min-w-40 ${
                index === selectedKeyIndex ? 'aqui un bg' : ''
              }`}
              name={keyName}
              key={keyName}
              tabIndex={index}
            >
              <span name={keyName} className='px-2 mr-1 min-w-8/12 rounded-md'>
                {key}
              </span>
              {inputState}
            </div>
          );
        })}
      </div>
    </div>
  );
};
