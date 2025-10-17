import { type FunctionComponent } from 'preact';
import { memo } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export interface IRankingProps {
  id: string;
  name: string;
  label?: string;
  value?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  error?: string;
  dataPage?: string;
  dataSection?: string;
}

export const Ranking: FunctionComponent<IRankingProps> = memo(
  ({
    id,
    label = '',
    value = 0,
    maxValue = 5,
    onChange,
    disabled = false,
    error,
    dataPage,
    dataSection,
  }: IRankingProps) => {
    const { t } = useTranslation();
    const [hoverValue, setHoverValue] = useState<number>(0);
    const [selectedValue, setSelectedValue] = useState<number>(value || 0);

    useEffect(() => {
      setSelectedValue(value || 0);
    }, [value]);

    const handleClick = (newValue: number) => {
      if (disabled) return;
      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    const handleMouseEnter = (newValue: number) => {
      if (disabled) return;
      setHoverValue(newValue);
    };

    const handleMouseLeave = () => {
      if (disabled) return;
      setHoverValue(0);
    };

    const displayValue = hoverValue || selectedValue;

    return (
      <div className='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
        {label && (
          <label
            htmlFor={`${id}-input`}
            className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'
          >
            {t(label)}
          </label>
        )}
        <div className='flex items-center space-x-1'>
          {[...Array(maxValue)].map((_, index) => {
            const ratingValue = index + 1;
            const isSelected = ratingValue <= displayValue;

            return (
              <button
                key={ratingValue}
                type='button'
                className={`
                  focus:outline-none border-0 p-0
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                onClick={() => handleClick(ratingValue)}
                onMouseEnter={() => handleMouseEnter(ratingValue)}
                onMouseLeave={handleMouseLeave}
                disabled={disabled}
                data-page={dataPage}
                data-section={dataSection}
              >
                <span
                  className={`
                    vox-icon vx-icon-260
                    text-2xl
                    ${
                      isSelected
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }
                    transition-colors duration-200
                  `}
                  style={{
                    WebkitTextFillColor: isSelected
                      ? '#fbbf24'
                      : 'currentColor',
                  }}
                />
              </button>
            );
          })}
        </div>
        {error && <span className='text-red-500 text-sm mt-1'>{error}</span>}
      </div>
    );
  }
);
