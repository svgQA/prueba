import { type FunctionComponent } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { memo } from 'preact/compat';
import { IDropdownOptions, type IDropdownProps } from './interface';

export const Dropdown: FunctionComponent<IDropdownProps> = memo(
  ({ id, name, label, options, labelTag = 'label' }: IDropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<IDropdownOptions | undefined>();

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
          }
        }
      },
      [options, labelTag, toggleDropdown]
    );

    const elementsList = useCallback(
      () =>
        options.map((element) => (
          <li
            key={`${element[labelTag]}-dropdown-element`}
            id={`${element[labelTag]}-dropdown-element`}
            data-name={`${element[labelTag]}`}
            class='block px-4 py-2'
          >
            {element[labelTag]}
          </li>
        )),
      [options, labelTag]
    );

    return (
      <div className='relative my-1 w-full'>
        <label
          for={`${id}-input`}
          className='capitalize block mb-1 text-sm font-medium'
        >
          {label}
        </label>
        <button
          id={`${id}-dropdown-button`}
          name={name}
          class='w-fullborder focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center'
          type='button'
          onClick={toggleDropdown}
        >
          {selected?.[labelTag] || 'No Selected'}
        </button>
        <div
          id={`${id}-dropdown`}
          className={`w-full z-10 ${isOpen ? '' : 'hidden'} absolute divide-y rounded-lg shadow`}
        >
          <ul className='py-2 text-sm' onClick={selectElement}>
            {elementsList()}
          </ul>
        </div>
      </div>
    );
  }
);
