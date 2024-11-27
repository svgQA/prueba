import { useDrag, useDrop } from 'react-dnd';
import {
  format,
  moveElement,
  validateSelectedElement,
  ELEMENT_TYPE_VALUES,
  REGEX_PATTERNS,
} from '../store';
import { TargetedEvent } from 'preact/compat';
import { IElementProps } from './interace';
import {
  Card,
  Input,
  MultipleInput,
  Select,
  Switch,
} from '@/components/common';
import { ELEMENT_TYPE, IElement } from '@/types/form';
import { IOption } from '@/components/common/interface';

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

  const onChangeMulty = (value: IOption[], name: string) => {
    updateForm(name, value);
  };

  const handleInputChange = (
    e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const [name, task] = target.name.includes('task-')
      ? target.name.split('-')
      : [target.name, undefined];
    const value =
      target.type === 'checkbox'
        ? (target as HTMLInputElement).checked
        : target.type === 'number' || target instanceof HTMLSelectElement
          ? isNaN(Number(target.value))
            ? target.value
            : Number(target.value)
          : target.value;

    if (!name) return;
    updateForm(name, value, task);
  };

  const updateForm = (name: string, value: unknown, task?: string | number) => {
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
                          ? name === 'task'
                            ? {
                                ...el,
                                tasks: element.tasks?.map((tsk) =>
                                  tsk.value == task
                                    ? {
                                        ...tsk,
                                        control: value as string | number,
                                      }
                                    : tsk
                                ),
                              }
                            : {
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
                  ? name === 'task'
                    ? {
                        ...element,
                        tasks: element.tasks?.map((tsk) =>
                          tsk.value == task
                            ? { ...tsk, control: value as string | number }
                            : tsk
                        ),
                      }
                    : {
                        ...element,
                        [name]: value,
                      }
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
      <tr ref={drop} className='vx-form-question relative'>
        {question.type === ELEMENT_TYPE.SECTION ? (
          <td
            colSpan={2}
            onClick={handleSelect}
            className={`${selected ? 'border-main border-2 border-primary before:content-[""] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-primary before:-top-1 before:-left-1 before:z-10 after:content-[""] after:absolute after:w-3 after:h-3 after:rounded-full after:bg-primary after:-bottom-1 after:-right-1 after:z-10' : ''}`}
          >
            {/* className={`${selected ? 'border-2 border-red-300' : ''}`} */}
            <div className='flex flex-row items-center'>
              <span
                ref={(node) => ref(drop(node))}
                className='vox-icon vx-icon-119 size-sm mx-2 cursor-move'
              ></span>
              <Input
                type='text'
                placeholder='Enter Section Title'
                name='label'
                id={`in-form-${question.id}-section-title`}
                data-sectionid={question.id}
                data-pageid={page}
                value={question.label}
                onChange={handleSectionInputChange}
                borderless
                thin
              />
            </div>
          </td>
        ) : (
          <>
            {/* INPUT: title element */}
            <td
              onClick={handleSelect}
              className={`flex flex-row relative ${selected ? 'border-main border-2 border-primary before:content-[""] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-primary before:-top-1 before:-left-1 before:z-10 after:content-[""] after:absolute after:w-3 after:h-3 after:rounded-full after:bg-primary after:-bottom-1 after:-right-1 after:z-10' : ''} ${
                isOver ? 'bg-ternary text-t-dark' : ''
              } ${isDragging ? 'opacity-70' : ''}`}
            >
              {question.section && (
                <div className=' mx-3 w-1 h-6 rounded-lg bg-primary dark:bg-b-light-dark'></div>
              )}
              <div className='flex flex-row w-full'>
                <span
                  ref={(node) => ref(drop(node))}
                  className='vox-icon vx-icon-119 size-sm mx-2 cursor-move'
                ></span>
                <Input
                  type='text'
                  name='label'
                  placeholder='Enter Element Title'
                  id={`in-form-${question.id}-element-title`}
                  value={question.label}
                  onChange={handleInputChange}
                  borderless
                  thin
                />
              </div>
            </td>
            {/* DROPDOW: select type */}
            <td onClick={handleSelect} className='w-3/12'>
              <Select
                placeholder='Type Element'
                id={`se-form-${question.id}-element-type`}
                icon='106'
                value={question.type}
                name='type'
                onChange={handleInputChange}
                options={ELEMENT_TYPE_VALUES}
                borderless
                thin
              />
            </td>
          </>
        )}
      </tr>

      <tr className='vx-form-question vx-form-attrs relative'>
        <td
          colspan={2}
          className={`${selected ? 'table-cell' : 'hidden'} relative`}
        >
          {/* CHECKBOX: required, visible, disable, administrator */}
          {question.type !== ELEMENT_TYPE.TITLE && (
            <div className='vx-form-attrs-checkbox'>
              <div>
                <input
                  id={`cb-form-${question.id}-element-required`}
                  checked={question.required}
                  type='checkbox'
                  name='required'
                  onChange={handleInputChange}
                  className='w-4 h-4 rounded'
                />
                <label
                  for={`cb-form-${question.id}-element-required`}
                  className='ms-2 text-sm font-medium'
                >
                  Required
                </label>
              </div>
              <div>
                <input
                  id={`cb-form-${question.id}-element-visible`}
                  checked={question.invisible}
                  type='checkbox'
                  name='invisible'
                  onChange={handleInputChange}
                  className='w-4 h-4 text-blue-600'
                />
                <label
                  for={`cb-form-${question.id}-element-visible`}
                  className='ms-2 text-sm font-medium'
                >
                  Invisible
                </label>
              </div>
              {question.type !== ELEMENT_TYPE.IMAGE &&
                question.type !== ELEMENT_TYPE.SIGNATURE && (
                  <div>
                    <input
                      id={`cb-form-${question.id}-element-disable`}
                      checked={question.disable}
                      type='checkbox'
                      name='disable'
                      onChange={handleInputChange}
                      className='w-4 h-4'
                    />
                    <label
                      for={`cb-form-${question.id}-element-disable`}
                      className='ms-2 text-sm font-medium'
                    >
                      Disable
                    </label>
                  </div>
                )}
              <div>
                <input
                  id={`cb-form-${question.id}-element-assigned`}
                  checked={question.assigned}
                  type='checkbox'
                  name='assigned'
                  onChange={handleInputChange}
                  className='w-4 h-4'
                />
                <label
                  for={`cb-form-${question.id}-element-assigned`}
                  className='ms-2 text-sm font-medium'
                >
                  Administrator
                </label>
              </div>
            </div>
          )}

          {/* INPUT: description, default value, regex, size, number files */}
          <div className='vx-form-attrs-fields'>
            <div className='col-span-2'>
              <textarea
                className='w-full min-h-6 vox-scroll-design'
                name='description'
                id={`ta-form-${question.id}-element-description`}
                value={question.description}
                onChange={handleInputChange}
                placeholder='Description'
              />
            </div>

            <div className='col-span-2 py-1'>
              {question.type === ELEMENT_TYPE.NUMBER_INPUT && (
                <Input
                  name='default'
                  label='Default'
                  type='number'
                  id={`in-number-form-${question.id}-element-default`}
                  value={question.default}
                  onChange={handleInputChange}
                  placeholder='Default value'
                  borderless
                  thin
                  icon='123'
                />
              )}
              {(question.type === ELEMENT_TYPE.INPUT ||
                question.type === ELEMENT_TYPE.TEXT_AREA) && (
                <Input
                  name='default'
                  label='Default'
                  type='text'
                  id={`in-text-form-${question.id}-element-default`}
                  value={question.default}
                  onChange={handleInputChange}
                  placeholder='Default value'
                  borderless
                  thin
                  icon='123'
                />
              )}
              {question.type === ELEMENT_TYPE.DROPDOWN && (
                <div className='w-full flex flex-row items-end'>
                  <div class='w-full mr-4'>
                    {/* onChange={handleInputChange} */}
                    <Select
                      label=''
                      name=''
                      placeholder='regex patters'
                      id={`se-form-${question.id}-element-options`}
                      value={question.regex}
                      options={[{ label: '112', value: 'Musica' }]}
                      icon='104'
                      borderless
                      thin
                    />
                  </div>
                  <Switch
                    label='URL'
                    name={`sw-form-${question.id}-element-option-type`}
                  />
                </div>
              )}
              {(question.type === ELEMENT_TYPE.CHECK_BOX ||
                question.type === ELEMENT_TYPE.RADIO_BUTTON) && (
                <MultipleInput
                  name='options'
                  label='Options'
                  id={`mt-form-${question.id}-element-options`}
                  icon='123'
                  value={question.options}
                  onChange={onChangeMulty}
                />
              )}
              {question.type === ELEMENT_TYPE.DATE && (
                <Input
                  name='default'
                  label='Default'
                  type='date'
                  id={`in-date-form-${question.id}-element-default`}
                  value={question.default}
                  onChange={handleInputChange}
                  borderless
                  thin
                  icon='123'
                />
              )}
              {question.type === ELEMENT_TYPE.TIME && (
                <Input
                  name='default'
                  label='Default'
                  type='time'
                  id={`in-time-form-${question.id}-element-default`}
                  value={question.default}
                  onChange={handleInputChange}
                  borderless
                  thin
                  icon='123'
                />
              )}
            </div>

            {question.type === ELEMENT_TYPE.INPUT && (
              <Select
                label='regex'
                name='regex'
                placeholder='regex patters'
                id={`se-form-${question.id}-element-regex`}
                value={question.regex}
                onChange={handleInputChange}
                options={REGEX_PATTERNS}
                icon='104'
                borderless
                thin
              />
            )}

            {(question.type === ELEMENT_TYPE.TIME ||
              question.type === ELEMENT_TYPE.DATE) && (
              <>
                <Input
                  name='min'
                  label='Minimun'
                  type={question.type === ELEMENT_TYPE.TIME ? 'time' : 'date'}
                  value={question.min}
                  id={`in-time-form-${question.id}-element-min`}
                  placeholder={`Min ${question.type === ELEMENT_TYPE.TIME ? 'Time' : 'Date'}`}
                  onChange={handleInputChange}
                  borderless
                  thin
                  icon='123'
                />
                <Input
                  name='max'
                  label='Maximum'
                  id={`in-time-form-${question.id}-element-max`}
                  type={question.type === ELEMENT_TYPE.TIME ? 'time' : 'date'}
                  value={question.max}
                  placeholder={`Max ${question.type === ELEMENT_TYPE.TIME ? 'Time' : 'Date'}`}
                  onChange={handleInputChange}
                  borderless
                  thin
                  icon='123'
                />
              </>
            )}

            {(question.type === ELEMENT_TYPE.NUMBER_INPUT ||
              question.type === ELEMENT_TYPE.RATING) && (
              <Input
                name='min'
                label='Minimun'
                type='number'
                id={`in-number-form-${question.id}-element-min`}
                value={question.min}
                placeholder='Min Length'
                onChange={handleInputChange}
                borderless
                thin
                icon='234'
              />
            )}

            {(question.type === ELEMENT_TYPE.INPUT ||
              question.type === ELEMENT_TYPE.NUMBER_INPUT ||
              question.type === ELEMENT_TYPE.TEXT_AREA ||
              question.type === ELEMENT_TYPE.RATING) && (
              <Input
                name='max'
                label='Maximum'
                type='number'
                id={`in-number-form-${question.id}-element-max`}
                value={question.max}
                placeholder='Max Length'
                onChange={handleInputChange}
                borderless
                thin
                icon='234'
              />
            )}

            {(question.type === ELEMENT_TYPE.IMAGE ||
              question.type === ELEMENT_TYPE.FILES ||
              question.type === ELEMENT_TYPE.AUDIO) && (
              <Input
                type='number'
                name='size'
                label='size'
                id={`in-number-form-${question.id}-element-size`}
                value={question.size}
                placeholder='Size'
                onChange={handleInputChange}
                borderless
                thin
                icon='234'
              />
            )}

            {(question.type === ELEMENT_TYPE.IMAGE ||
              question.type === ELEMENT_TYPE.FILES) && (
              <Input
                type='number'
                name='maxNumberFiles'
                label='Number Files'
                id={`in-number-form-${question.id}-element-files`}
                value={question.maxNumberFiles}
                placeholder='Number Files'
                onChange={handleInputChange}
                borderless
                thin
                icon='234'
              />
            )}

            {(question.type === ELEMENT_TYPE.CHECK_BOX ||
              question.type === ELEMENT_TYPE.RADIO_BUTTON) && (
              <div className='col-span-2'>
                <MultipleInput
                  name='tasks'
                  label='Tasks'
                  id={`mt-form-${question.id}-element-tasks`}
                  icon='123'
                  value={question.tasks}
                  onChange={onChangeMulty}
                  bottom
                  getElement={(option: IOption, index: number) => (
                    <Card
                      key={`task-validation-${question}-${index}`}
                      color='bg-transparent'
                      maxWidth='w-52'
                    >
                      <p className='font-bold truncate mt-2'>{option.label}</p>
                      {question.options && question.tasks && (
                        <Select
                          name={`task-${option.value}`}
                          id={`sl-task-${question.id}-${option.value}`}
                          options={question.options}
                          value={question.tasks[index].control}
                          onChange={handleInputChange}
                          borderless
                          icon='079'
                        />
                      )}
                    </Card>
                  )}
                />
              </div>
            )}
          </div>

          {/* BUTTON: delete */}
          <div
            class='-right-9 2xl:-right-11 absolute cursor-pointer w-8 h-8 rounded-md text-center top-1/4 border-2 border-b-light-dark dark:border-b-dark-light'
            onClick={handleDelete}
          >
            <span className='vox-icon vx-icon-053 size-sm' />
          </div>
        </td>
      </tr>

      {question.type === ELEMENT_TYPE.SECTION && (
        <>
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
        </>
      )}
    </>
  );
};
