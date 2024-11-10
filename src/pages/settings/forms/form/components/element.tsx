import { useDrag, useDrop } from 'react-dnd';
import {
  format,
  moveElement,
  IElement,
  ELEMENT_TYPE,
  validateSelectedElement,
  ELEMENT_TYPE_VALUES,
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

  const handleInputChange = (
    e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const name = target.name;
    const value =
      target.type === 'checkbox'
        ? (target as HTMLInputElement).checked
        : target.type === 'number' || target instanceof HTMLSelectElement
          ? isNaN(Number(target.value))
            ? target.value
            : Number(target.value)
          : target.value;

    if (!name) return;

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
                              [name]: value,
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
                  ? { ...element, [name]: value }
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
      <tr
        ref={drop}
        className={`vx-form-question relative ${selected ? 'border-teal-500 border-x-2 border-t-2 before:content-[""] before:absolute before:w-3 before:h-3 before:bg-teal-500 before:-top-0.5 before:-left-0.5' : ''}`}
      >
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
            {/* INPUT: title element */}
            <td
              onClick={handleSelect}
              class='w-9/12'
              className={`flex flex-row ${
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
                name='label'
                placeholder='Enter Element Title'
                value={question.label}
                onChange={handleInputChange}
              />
            </td>
            {/* DROPDOWN: select type */}
            <td onClick={handleSelect} className='w-3/12 pr-2'>
              <div className='relative w-full flex flex-row'>
                <span className='vox-icon size-sm vx-icon-091' />
                <select
                  value={question.type}
                  name='type'
                  onChange={handleInputChange}
                  className='w-full px-3 pr-8 border border-gray-300 bg-transparent rounded-md text-sm transition duration-150 ease-in-out appearance-none'
                >
                  {ELEMENT_TYPE_VALUES.map((element) => (
                    <option
                      key={`opt-type-${element.value}`}
                      value={element.value}
                    >
                      {element.label}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </>
        )}
      </tr>
      {question.type !== ELEMENT_TYPE.SECTION && (
        <tr
          className={`vx-form-question relative ${selected ? 'border-teal-500 border-x-2 border-b-2 after:content-[""] after:absolute after:w-3 after:h-3 after:bg-teal-500 after:-bottom-0.5 after:-right-0.5' : ''}`}
        >
          {question.type !== ELEMENT_TYPE.TITLE && (
            <td
              colspan={2}
              className={`${selected ? 'table-cell' : 'hidden'} relative`}
            >
              {/* CHECKBOX: required, visible, disable, administrator */}
              {question.type !== ELEMENT_TYPE.PARAGRAPH && (
                <div className='vx-form-attrs'>
                  <div>
                    <input
                      id={`cb-required-form-${question.id}`}
                      checked={question.required}
                      type='checkbox'
                      name='required'
                      onChange={handleInputChange}
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
                      name='visible'
                      onChange={handleInputChange}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                    />
                    <label
                      for={`cb-visible-form-${question.id}`}
                      className='ms-2 text-sm font-medium text-gray-800 dark:text-gray-800'
                    >
                      Visible
                    </label>
                  </div>
                  {question.type !== ELEMENT_TYPE.IMAGE &&
                    question.type !== ELEMENT_TYPE.SIGNATURE && (
                      <div>
                        <input
                          id={`cb-disable-form-${question.id}`}
                          checked={question.disable}
                          type='checkbox'
                          name='disable'
                          onChange={handleInputChange}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label
                          for={`cb-disable-form-${question.id}`}
                          className='ms-2 text-sm font-medium text-gray-800 dark:text-gray-800'
                        >
                          Disable
                        </label>
                      </div>
                    )}
                  <div>
                    <input
                      id={`cb-assigned-form-${question.id}`}
                      checked={question.assigned}
                      type='checkbox'
                      name='assigned'
                      onChange={handleInputChange}
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
              )}

              {/* INPUT: description, default value, regex, size, number files */}
              <div className='grid grid-cols-2 gap-3 mx-2'>
                <div className='col-span-2 m-0 p-0'>
                  <textarea
                    className='w-full min-h-6'
                    name='description'
                    value={question.description}
                    onChange={handleInputChange}
                    placeholder='Description'
                  />
                </div>

                {/* <div className='col-span-2 py-1'>
                <input
                  className='w-full'
                  type='number'
                  name='default'
                  value={question.default}
                  placeholder='Default Value'
                />
              </div> */}

                {question.type === ELEMENT_TYPE.INPUT && (
                  <div>
                    <select
                      className='w-full border border-gray-300 bg-transparent rounded-md text-sm'
                      name='regex'
                      value={question.regex}
                      onChange={handleInputChange}
                    >
                      <option value=''>Select a regex pattern</option>
                      <option value='^[A-Za-z0-9]+$'>Alphanumeric only</option>
                      <option value='^[A-Za-z]+$'>Letters only</option>
                      <option value='^[0-9]+$'>Numbers only</option>
                      <option value='^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'>
                        Email
                      </option>
                      <option value='^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'>
                        Phone number
                      </option>
                      <option value='^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$'>
                        URL
                      </option>
                      {/* <option value='custom'>Custom Regex...</option> */}
                    </select>
                  </div>
                )}

                {(question.type === ELEMENT_TYPE.TIME ||
                  question.type === ELEMENT_TYPE.DATE) && (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Minimum
                      </label>
                      <div className='relative'>
                        <input
                          className='w-full border border-gray-300 rounded-md transition-colors'
                          name='min'
                          type={
                            question.type === ELEMENT_TYPE.TIME
                              ? 'time'
                              : 'date'
                          }
                          value={question.min}
                          placeholder={`Min ${question.type === ELEMENT_TYPE.TIME ? 'Time' : 'Date'}`}
                          onChange={handleInputChange}
                        />
                        <span
                          className={`absolute vox-icon size-sm inset-y-0 right-5 ${question.type === ELEMENT_TYPE.TIME ? 'vx-icon-049' : 'vx-icon-025'}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Maximum
                      </label>
                      <div className='relative'>
                        <input
                          className='w-full border border-gray-300 rounded-md transition-colors'
                          name='max'
                          type={
                            question.type === ELEMENT_TYPE.TIME
                              ? 'time'
                              : 'date'
                          }
                          value={question.max}
                          placeholder={`Max ${question.type === ELEMENT_TYPE.TIME ? 'Time' : 'Date'}`}
                          onChange={handleInputChange}
                        />
                        <span
                          className={`absolute vox-icon size-sm inset-y-0 right-5 ${question.type === ELEMENT_TYPE.TIME ? 'vx-icon-049' : 'vx-icon-025'}`}
                        />
                      </div>
                    </div>
                  </>
                )}

                {(question.type === ELEMENT_TYPE.NUMBER_INPUT ||
                  question.type === ELEMENT_TYPE.RATING) && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Minimum
                    </label>
                    <div className='relative'>
                      <input
                        className='w-full'
                        name='min'
                        value={question.min}
                        placeholder='Min Length'
                        onChange={handleInputChange}
                      />
                      <span className='absolute vox-icon size-sm inset-y-0 right-5 vx-icon-001' />
                    </div>
                  </div>
                )}

                {(question.type === ELEMENT_TYPE.INPUT ||
                  question.type === ELEMENT_TYPE.NUMBER_INPUT ||
                  question.type === ELEMENT_TYPE.TEXT_AREA ||
                  question.type === ELEMENT_TYPE.RATING) && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Maximum
                    </label>
                    <div className='relative'>
                      <input
                        className='w-full'
                        name='max'
                        value={question.min}
                        placeholder='Max Length'
                        onChange={handleInputChange}
                      />
                      <span className='absolute vox-icon size-sm inset-y-0 right-5 vx-icon-002' />
                    </div>
                  </div>
                )}

                {(question.type === ELEMENT_TYPE.IMAGE ||
                  question.type === ELEMENT_TYPE.FILES ||
                  question.type === ELEMENT_TYPE.AUDIO) && (
                  <div>
                    <input
                      className='w-full'
                      type='number'
                      name='size'
                      value={question.size}
                      placeholder='Size'
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                {(question.type === ELEMENT_TYPE.IMAGE ||
                  question.type === ELEMENT_TYPE.FILES) && (
                  <div>
                    <input
                      className='w-full'
                      type='number'
                      name='maxNumberFiles'
                      value={question.maxNumberFiles}
                      placeholder='Number Files'
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              {/* BUTTON: delete */}
              <div
                class='-right-9 2xl:-right-11 bg-red-400 absolute cursor-pointer text-white w-8 h-8 rounded-md text-center top-1/4'
                onClick={handleDelete}
              >
                <span className='vox-icon vx-icon-053 size-sm' />
                <h6 className='text-2xs'>Delete</h6>
              </div>
            </td>
          )}
        </tr>
      )}
    </>
  );
};
