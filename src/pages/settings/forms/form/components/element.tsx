import { useDrag, useDrop } from 'react-dnd';
import {
  format,
  moveElement,
  IElement,
  ELEMENT_TYPE,
  validateSelectedElement,
} from '../store';
import { TargetedEvent } from 'preact/compat';
import '../assets/index.css';
import { IElementProps } from './interace';

const ItemType = {
  QUESTION: 'question',
};

export const FormElement = ({
  question,
  index,
  page,
  section,
  selected,
  onSelect,
  onDelete,
}: IElementProps) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType.QUESTION,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.QUESTION,
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        moveElement(item.index, index, page, section);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    format.value = {
      ...format.value,
      pages: format.value.pages.map((p) => {
        if (p.id === page) {
          if (section) {
            return {
              ...p,
              elements: p.elements.map((element: IElement) =>
                element.id === section
                  ? {
                      ...element,
                      elements: element.elements?.map((el) =>
                        el.id === question.id
                          ? {
                              ...el,
                              label: value,
                            }
                          : el
                      ),
                    }
                  : element
              ),
            };
          } else {
            return {
              ...p,
              elements: p.elements.map((element: IElement) =>
                element.id === question.id
                  ? { ...element, label: value }
                  : element
              ),
            };
          }
        }
        return p;
      }),
    };
  };

  const handleSectionInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const sectionId = e.currentTarget.getAttribute('data-sectionid');
    const pageId = e.currentTarget.getAttribute('data-pageid');
    if (!sectionId || !pageId) return;

    format.value = {
      ...format.value,
      pages: format.value.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          elements: page.elements.map((element) => {
            if (element.id === sectionId) {
              return { ...element, [name]: value };
            }
            return element;
          }),
        };
      }),
    };
  };

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation();
    onSelect(question.id, page, section);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(question.id, page, section);
  };

  return (
    <>
      <tr ref={drop} className='vx-form-question'>
        {question.type === ELEMENT_TYPE.SECTION ? (
          <td colSpan={2} className='bg-gray-200'>
            <div className='font-bold border-b py-2 border-gray-200 flex flex-row items-center'>
              <span
                ref={(node) => ref(drop(node))}
                className='cursor-move vx-icon vx-apps size-sm mx-2'
              ></span>
              <input
                type='text'
                className='w-full text-xl font-bold border border-gray-200 rounded'
                placeholder='Enter Section Title'
                name='label'
                data-sectionid={question.id}
                data-pageid={page}
                value={question.label}
                onChange={handleSectionInputChange}
              />
            </div>
            <table className='w-full'>
              <tbody>
                {question.elements?.map((element, index) => (
                  <FormElement
                    key={element.id}
                    question={element}
                    page={page}
                    index={index}
                    section={question.id}
                    selected={validateSelectedElement(element.id)}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </td>
        ) : (
          <>
            {/* before:content-[""] before:absolute before:w-3 before:h-3 before:bg-teal-500 before:top-0 before:left-0 after:content-[""] after:absolute after:w-3 after:h-3 after:bg-teal-500 after:bottom-0 after:right-0 */}
            <td
              onClick={handleSelect}
              class='w-9/12'
              className={`flex flex-row relative ${selected ? 'border-2 border-teal-500 before:content-[""] before:absolute before:w-3 before:h-3 before:bg-teal-500 before:top-0 before:left-0 after:content-[""] after:absolute after:w-3 after:h-3 after:bg-teal-500 after:bottom-0 after:right-0' : ''} ${
                isOver ? 'bg-blue-100' : ''
              } ${isDragging ? 'opacity-50' : ''}`}
            >
              <span
                ref={(node) => ref(drop(node))}
                className='cursor-move vx-icon vx-apps size-sm mx-2'
              ></span>
              <input
                type='text'
                className='w-full'
                placeholder='Enter Element Title'
                value={question.label}
                onChange={handleInputChange}
              />
            </td>
            <td className='w-3/12'>
              <select value={question.type} className='bg-transparent'>
                <option value='text'>Text answer</option>
                <option value='date'>Inspection date</option>
                <option value='person'>Person</option>
                <option value='location'>Inspection location</option>
              </select>
            </td>
          </>
        )}
      </tr>
      {question.type !== ELEMENT_TYPE.SECTION && (
        <tr className='vx-form-question'>
          <td
            colspan={2}
            className={`${selected ? 'table-cell' : 'hidden'} relative`}
          >
            <div className='vx-form-attrs bg-blue-200'>
              <div>
                <input
                  id={`cb-required-form-${question.id}`}
                  checked={question.required}
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  for={`cb-required-form-${question.id}`}
                  className='ms-2 text-sm font-medium text-gray-800 dark:text-gray-800'
                >
                  Required
                </label>
              </div>
              <div>
                <input
                  id={`cb-visible-form-${question.id}`}
                  checked={question.visible}
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  for={`cb-visible-form-${question.id}`}
                  className='ms-2 text-sm font-medium text-gray-800 dark:text-gray-800'
                >
                  Visible
                </label>
              </div>
              <div>
                <input
                  id={`cb-disable-form-${question.id}`}
                  checked={question.disable}
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  for={`cb-disable-form-${question.id}`}
                  className='ms-2 text-sm font-medium text-gray-800 dark:text-gray-800'
                >
                  Disable
                </label>
              </div>
              <div>
                <input
                  id={`cb-assigned-form-${question.id}`}
                  checked={question.assigned}
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  for={`cb-assigned-form-${question.id}`}
                  className='ms-2 text-sm font-medium text-gray-800 dark:text-gray-800'
                >
                  Administrator
                </label>
              </div>
            </div>
            <div className='p-2 bg-red-200'>OTRA MIERDA</div>
            <div
              class='bg-red-400 absolute cursor-pointer text-white w-8 h-8 rounded-md text-center top-1/4 -right-10 2xl:-right-12'
              onClick={handleDelete}
            >
              <span className='vox-icon vx-icon-053 size-sm' />
              <h6 className='text-2xs'>Delete</h6>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
