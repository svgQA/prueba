import { useState } from 'preact/hooks';
import { IMultiProps } from './interface';
import { Chip } from '../chip/chip';
import { Input } from '../input/input';

export const MultipleInput = ({ value = [], onChange }: IMultiProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      const newValue = [...value, inputValue];
      onChange(newValue);
      setInputValue('');
    }
  };

  const handleDelete = (chipToDelete: string) => {
    const newValue = value.filter((item) => item !== chipToDelete);
    onChange(newValue);
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  };

  return (
    <div className='w-full'>
      <div className='flex flex-wrap gap-2 mb-2'>
        {value.map((item, index) => (
          <Chip key={index} label={item} onDelete={() => handleDelete(item)} />
        ))}
      </div>
      <Input
        type='text'
        name='multi-input'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='Type and press Enter'
      />
    </div>
  );
};
