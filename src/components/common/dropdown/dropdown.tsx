import { type FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { IDropdownElement, type IDropdownProps } from './interface';

export const Dropdown: FunctionComponent<IDropdownProps> = ({
  id,
  name,
  label,
  elements,
  labelTag = 'label',
}: IDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<IDropdownElement>({});

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectElement = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'LI') {
      const menuClicked = target.getAttribute('name');
      if (menuClicked) {
        const element = elements.find(
          (element) => element[labelTag] === menuClicked
        );
        if (!element) return;
        setSelected(element);
        toggleDropdown();
      }
    }
  };

  return (
    <div className='relative my-1 w-full'>
      <label
        for={`${id}-input`}
        className='capitalize block mb-1 text-sm font-medium text-gray-900 dark:text-white'
      >
        {label}
      </label>
      <button
        id={`${id}-dropdown-button`}
        name={name}
        class='w-full text-gray-600 border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        type='button'
        onClick={toggleDropdown}
      >
        {selected[labelTag] || 'No Selected'}
      </button>
      <div
        id={`${id}-dropdown`}
        className={`w-full z-10 ${isOpen ? '' : 'hidden'} absolute bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}
      >
        <ul
          className='py-2 text-sm text-gray-700 dark:text-gray-200'
          onClick={selectElement}
        >
          {elements.map((element) => (
            <li
              key={`${element[labelTag]}-dropdown-element`}
              id={`${element[labelTag]}-dropdown-element`}
              name={`${element[labelTag]}`}
              class='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
            >
              {element[labelTag]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
