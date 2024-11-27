import { useState, useCallback, useMemo } from 'preact/hooks';
import { IMultiProps } from './interface';
import { Chip } from '../chip/chip';
import { Input } from '../input/input';

export const MultipleInput = ({
  value = [],
  onChange,
  label,
  name,
  id,
  icon,
  bottom,
  placeholder,
  getElement,
}: IMultiProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && inputValue) {
        const newValue = [...value, { value: value.length, label: inputValue }];
        onChange(newValue, name);
        setInputValue('');
      }
    },
    [inputValue, value, onChange, name]
  );

  const handleDelete = useCallback(
    (chipToDelete: string | number) => {
      const newValue = value.filter((item) => item.value !== chipToDelete);
      onChange(newValue, name);
    },
    [value, onChange, name]
  );

  const handleInputChange = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }, []);

  const defaultChips = useMemo(
    () => (
      <div className='flex flex-wrap gap-1 justify-center'>
        {Array.isArray(value) &&
          value.map((item, index) =>
            getElement ? (
              <div className='relative border rounded-md flex flex-col border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'>
                <span
                  className='absolute z-10 right-2 top-0.5 vox-icon vx-icon-192 size-sm cursor-pointer'
                  onClick={() => handleDelete(item.value)}
                ></span>
                {getElement(item, index)}
              </div>
            ) : (
              <Chip
                key={item.value}
                label={item.label}
                onDelete={() => handleDelete(item.value)}
              />
            )
          )}
      </div>
    ),
    [value, handleDelete]
  );

  return (
    <div className='w-full'>
      {!bottom && defaultChips}
      <Input
        type='text'
        label={label}
        name={name}
        id={id}
        icon={icon}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Type and press Enter'}
      />
      {bottom && defaultChips}
    </div>
  );
};
