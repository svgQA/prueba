import { useDrag, useDrop } from 'react-dnd';
import { TargetedEvent } from 'preact/compat';
import { IElementProps } from './interace';
import { ELEMENT_TYPE } from '@/types/form';
import { IOption } from '@/components/common/multi/interface';
import { Input } from '@/components/common/input/input';
import { Select } from '@/components/common/select/select';
import { Switch } from '@/components/common/switch/switch';
import { MultipleInput } from '@/components/common/multi/multi';
import { Card } from '@/components/common/card/card';
import { moveElement, updateForm, updateSectionForm } from '../store/question';
import { ELEMENT_TYPE_VALUES, REGEX_PATTERNS } from '../store/constant';
import { validateSelectedElement } from '../store/control';
import { toggleListModal } from '../../lists/store/list';
import { toast } from 'react-toastify';
import i18n from '@/i18n';
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
  const openModalList = () => {
    toggleListModal({ question: question.id, page, section, field: 'options' });
  };

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
    updateForm(question.id, page, section)(name, value);
  };

  const onTestUrl = (event: string) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)(:\d+)?([/\w .-]*)*\/?$/;
    const isURL = urlPattern.test(event);

    if (!isURL) {
      toast.error('No es una url valida!', {
        position: 'top-right',
      });
      return;
    }

    fetch(event)
      .then((res) => res.json())
      .then((data) => {
        if (
          !Array.isArray(data) ||
          !data.every(
            (item) =>
              typeof item === 'object' && 'label' in item && 'value' in item
          )
        ) {
          toast.error('La estructura de datos no es válida', {
            position: 'top-right',
          });
          return;
        }
        toast.success('Los datos estan bien.');
        updateForm(question.id, page, section)('options', data.slice(0, 50));
      })
      .catch(() => {
        toast.error('Error al obtener los datos', {
          position: 'top-right',
        });
      });
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
    updateForm(question.id, page, section)(name, value, task);
  };

  const handleSectionInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const section_id = e.currentTarget.getAttribute('data-sectionid');
    const page_id = e.currentTarget.getAttribute('data-pageid');
    if (!section_id || !page_id) return;
    updateSectionForm(name, value, page_id, section_id);
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
            className={`dark:bg-gray-800 ${selected ? 'border-main border-2 border-primary before:content-[""] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-primary before:-top-1 before:-left-1 before:z-10 after:content-[""] after:absolute after:w-3 after:h-3 after:rounded-full after:bg-primary after:-bottom-1 after:-right-1 after:z-10' : ''}`}
          >
            {/* className={`${selected ? 'border-2 border-red-300' : ''}`} */}
            <div className='flex flex-row items-center'>
              <span
                ref={(node) => ref(drop(node))}
                className='vox-icon vx-icon-119 size-sm mx-2 cursor-move'
              ></span>
              <Input
                type='text'
                placeholder={i18n.t('form.placeholder.section_title')}
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
              className={`rounded-bl-xl dark:bg-gray-800 flex flex-row relative ${selected ? 'border-main border-2 border-primary before:content-[""] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-primary before:-top-1 before:-left-1 before:z-10 after:content-[""] after:absolute after:w-3 after:h-3 after:rounded-full after:bg-primary after:-bottom-1 after:-right-1 after:z-10' : ''} ${
                isOver ? 'bg-ternary text-t-dark' : ''
              } ${isDragging ? 'opacity-70' : ''} items-center`}
            >
              {question.section && (
                <div className=' mx-3 w-1 h-6 rounded-lg bg-primary dark:bg-b-light-dark'></div>
              )}
              <div className='flex flex-row w-full items-center'>
                <span
                  ref={(node) => ref(drop(node))}
                  className='vox-icon vx-icon-119 size-sm mx-2 cursor-move'
                ></span>
                <Input
                  type='text'
                  name='label'
                  placeholder={i18n.t('form.placeholder.element_title')}
                  id={`in-form-${question.id}-element-title`}
                  value={question.label}
                  onChange={handleInputChange}
                  borderless
                  thin
                />
              </div>
            </td>
            {/* DROPDOW: select type */}
            <td
              onClick={handleSelect}
              className='w-3/12 dark:bg-gray-800 rounded-br-xl'
            >
              <Select
                placeholder={i18n.t('form.placeholder.type_element')}
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
          className={`${selected ? 'table-cell' : 'hidden'} relative rounded-b-xl`}
        >
          {/* CHECKBOX: required, visible, disable, administrator */}
          {question.type !== ELEMENT_TYPE.TITLE && (
            <div className='vx-form-attrs-checkbox'>
              <Switch
                id={`cb-form-${question.id}-element-required`}
                name='required'
                label={i18n.t('form.label.required')}
                onChange={handleInputChange}
                value={question.required}
              />

              <Switch
                id={`cb-form-${question.id}-element-visible`}
                name='invisible'
                label={i18n.t('form.label.invisible')}
                onChange={handleInputChange}
                value={question.invisible}
              />

              {question.type !== ELEMENT_TYPE.IMAGE &&
                question.type !== ELEMENT_TYPE.SIGNATURE && (
                  <Switch
                    id={`cb-form-${question.id}-element-disable`}
                    name='disable'
                    label={i18n.t('form.label.disable')}
                    onChange={handleInputChange}
                    value={question.disable}
                  />
                )}
              <Switch
                id={`cb-form-${question.id}-element-assigned`}
                name='assigned'
                label={i18n.t('form.label.administrator')}
                onChange={handleInputChange}
                value={question.assigned}
              />
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
                placeholder={i18n.t('form.placeholder.element_description')}
              />
            </div>

            <div className='col-span-2 py-1'>
              {question.type === ELEMENT_TYPE.NUMBER_INPUT && (
                <Input
                  name='default'
                  label={i18n.t('form.label.default')}
                  type='number'
                  id={`in-number-form-${question.id}-element-default`}
                  value={question.default}
                  onChange={handleInputChange}
                  placeholder={i18n.t('form.placeholder.default_value')}
                  borderless
                  thin
                  icon='123'
                />
              )}
              {(question.type === ELEMENT_TYPE.INPUT ||
                question.type === ELEMENT_TYPE.TEXT_AREA) && (
                <Input
                  name='default'
                  label={i18n.t('form.label.default')}
                  type='text'
                  id={`in-text-form-${question.id}-element-default`}
                  value={question.default}
                  onChange={handleInputChange}
                  placeholder={i18n.t('form.placeholder.default_value')}
                  borderless
                  thin
                  icon='123'
                />
              )}
              {question.type === ELEMENT_TYPE.DROPDOWN && (
                <div className='w-full flex flex-row items-center h-20'>
                  <div class='w-full mr-4'>
                    {question.isUrl ? (
                      <Input
                        label={i18n.t('form.label.list_url')}
                        name='url'
                        placeholder={i18n.t('form.placeholder.list_url')}
                        onChange={handleInputChange}
                        id={`se-form-${question.id}-element-options-url`}
                        icon='104'
                        onClick={onTestUrl}
                        value={question.url}
                        button
                        borderless
                        thin
                        normal
                      />
                    ) : (
                      <MultipleInput
                        name='options'
                        label='Options'
                        id={`mt-form-${question.id}-element-options`}
                        icon='123'
                        value={question.options}
                        onChange={onChangeMulty}
                        button
                        onSelect={openModalList}
                        buttonIcon='093'
                        scrollable
                      />
                    )}
                  </div>
                  <Switch
                    label='URL'
                    value={question.isUrl}
                    onChange={handleInputChange}
                    name='isUrl'
                    id={`sw-form-${question.id}-element-option-type`}
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
                  button
                  onSelect={openModalList}
                  buttonIcon='093'
                  scrollable
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
                label={i18n.t('form.label.regex')}
                name='regex'
                placeholder={i18n.t('form.placeholder.regex_patters')}
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
                  label={i18n.t('form.label.maximum')}
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
                placeholder={i18n.t('form.placeholder.min_length')}
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
                placeholder={i18n.t('form.placeholder.max_length')}
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
                placeholder={i18n.t('form.placeholder.size')}
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
                placeholder={i18n.t('form.placeholder.number_files')}
                onChange={handleInputChange}
                borderless
                thin
                icon='234'
              />
            )}

            {(question.type === ELEMENT_TYPE.CHECK_BOX ||
              question.type === ELEMENT_TYPE.RADIO_BUTTON ||
              question.type === ELEMENT_TYPE.SWITCH) && (
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
