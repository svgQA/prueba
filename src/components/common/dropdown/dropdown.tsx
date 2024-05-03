import { type FunctionComponent } from 'preact';
import { type IDropdownProps } from './interface';

export const Dropdown: FunctionComponent<IDropdownProps> = ({
  id,
  name,
  title,
}: IDropdownProps) => {
  return (
    <>
      <button id={`${id}-button`} name={name}>
        {title}
      </button>
      <div id={`${id}-hover`}>
        <ul aria-labelledby={`${id}-button`}>
          <li>
            <a href='#'>Dashboard</a>
          </li>
        </ul>
      </div>
    </>
  );
};
