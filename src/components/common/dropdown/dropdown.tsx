import { type FunctionComponent } from 'preact';
import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { memo } from 'preact/compat';
import { IDropdownOptions, type IDropdownProps } from './interface';

export const Dropdown: FunctionComponent<IDropdownProps> = memo(
  ({
    id,
    name,
    label,
    options,
    labelTag = 'label',
    icon,
    iconSize = 'sm',
    onChange,
  }: IDropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<IDropdownOptions | undefined>();
    const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>(
      'right'
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const selectElement = useCallback(
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.nodeName === 'LI') {
          const menuClicked = target.getAttribute('data-name');
          if (menuClicked) {
            const element = options.find(
              (element) => element[labelTag] === menuClicked
            );
            if (!element) return;
            setSelected(element);
            toggleDropdown();
            onChange?.(element.value);
          }
        }
      },
      [options, labelTag, toggleDropdown, onChange]
    );

    const elementsList = useCallback(
      () =>
        options.map((element) => (
          <li
            key={`${element[labelTag]}-dropdown-element`}
            id={`${element[labelTag]}-dropdown-element`}
            data-name={`${element[labelTag]}`}
            class='block px-4 py-2 whitespace-nowrap hover:bg-gray-100 cursor-pointer transition-colors duration-150'
          >
            {icon && (
              <span
                className={`vox-icon vx-icon-${element.icon} size-sm mr-2`}
              />
            )}
            {element[labelTag]}
          </li>
        )),
      [options, labelTag]
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const spaceOnRight = windowWidth - buttonRect.right;
        const dropdownWidth = 200; // Ancho estimado del dropdown

        setDropdownPosition(spaceOnRight >= dropdownWidth ? 'right' : 'left');
      }
    }, [isOpen]);

    const isIconOnly = !label && icon;

    return (
      <div
        ref={dropdownRef}
        className={`relative my-1 ${isIconOnly ? 'inline-block' : 'w-full'}`}
      >
        {label && (
          <label
            for={`${id}-input`}
            className='capitalize block mb-1 text-sm font-medium'
          >
            {label}
          </label>
        )}
        <button
          ref={buttonRef}
          id={`${id}-dropdown-button`}
          name={name}
          class={`focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center transition-colors duration-150 ${
            isIconOnly
              ? 'border-none justify-center hover:bg-gray-100'
              : 'w-full border focus:ring-blue-300 hover:bg-gray-50'
          }`}
          type='button'
          onClick={toggleDropdown}
        >
          {icon && (
            <span
              className={`vox-icon vx-icon-${icon} size-${iconSize} ${!isIconOnly ? 'mr-2' : ''}`}
            />
          )}
          {!isIconOnly && (selected?.[labelTag] || 'No Selected')}
        </button>
        <div
          id={`${id}-dropdown`}
          className={`${isIconOnly ? 'w-fit' : 'w-full'} z-10 ${isOpen ? '' : 'hidden'} absolute divide-y rounded-lg shadow bg-white ${
            dropdownPosition === 'left' ? 'right-0' : 'left-0'
          }`}
        >
          <ul className='py-2 text-sm' onClick={selectElement}>
            {elementsList()}
          </ul>
        </div>
      </div>
    );
  }
);
