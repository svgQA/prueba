import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormService } from '@/services';
import { IFormRequest, IListResponse } from '@/types/form';
import { ListFormModal } from '../lists/lists';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import {
  getSelectedElement,
  setSelectedElement,
  validateSelectedElement,
} from './store/control';
import {
  addElement,
  addPage,
  addSection,
  FORMAT_MODE_SERVICE,
  getForm,
  getFormMode,
  removeElement,
  udpateGeneralForm,
  updateForm,
  updatePageForm,
} from './store/question';
import { setPhonePage } from './store/phone';
import { TargetedEvent } from 'preact/compat';
import { FormButton } from '@/components/compose/button';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { FormElement } from './components/element';
import { FormPhoneViewer } from './components/phone';
import { getStatusElementSelected, toggleListModal } from '../lists/store/list';
import i18n from '@/i18n';
import { ToastManager } from '@/utils/toast/toast-manager';
import { formValidation } from './utils/validation';
export const FormCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  useEffect(() => {
    document.title = 'Forms Create Settings';
  }, []);

  const handleSelect = (id: string, page: string, section?: string) => {
    if (id === getSelectedElement.value?.id) return;
    setSelectedElement({ id, page, section });
    const pageIndex = getForm.value.pages.findIndex((p) => p.id === page);
    if (pageIndex >= 0) {
      setPhonePage(pageIndex);
    }
  };

  const saveFormat = async () => {
    const format: IFormRequest = {
      title: getForm.value.label,
      description: getForm.value.description || '',
      structure: getForm.value,
    };

    const message = formValidation(format);
    if (message) return ToastManager.error(message);

    if (getFormMode.value.mode === FORMAT_MODE_SERVICE.UPDATE) {
      if (!getFormMode.value.id) return;
      const response = await FormService.update(format, getFormMode.value.id);
      if (!response.getStatus()) return;
    } else {
      const response = await FormService.create(format);
      if (!response.getStatus()) return;
    }
    navigate(PAGES_LIST_ROUTER.dashboard.setting.forms.form.to);
  };

  const addLelement = () => {
    if (!getSelectedElement.value) return;
    addElement(getSelectedElement.value.page, getSelectedElement.value.section);
  };

  const addLsection = () => {
    if (!getSelectedElement.value) return;
    addSection(getSelectedElement.value.page);
  };

  const handleFormatInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    udpateGeneralForm(name, value);
  };

  const handlePageInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const page_id = e.currentTarget.getAttribute('data-pageid');
    if (!page_id) return;
    updatePageForm(name, value, page_id);
  };

  const onSelectedList = (element: IListResponse) => {
    const selected = getStatusElementSelected.value;
    if (!selected) return;
    updateForm(
      selected.question,
      selected.page,
      selected.section
    )(selected.field, element.structure);
    toggleListModal();
  };

  return (
    <section className='flex flex-row'>
      <div class='sticky top-1/2 -translate-y-1/2 h-44 flex flex-col gap-2'>
        <FormButton
          onClick={addLelement}
          color='bg-ternary'
          label='element'
          icon='245'
        />
        <FormButton
          onClick={addLsection}
          color='bg-primary'
          label='section'
          icon='274'
        />
        <FormButton
          onClick={addPage}
          color='bg-ternary'
          label='page'
          icon='064'
        />
      </div>
      <div class='flex-grow min-h-[78vh] p-3'>
        <div className='flex flex-row w-full items-center mb-4 gap-5 pr-12'>
          <div className='w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer'>
            <span className='vx-icon vx-upload text-gray-400 text-2xl' />
          </div>
          <div className='flex flex-col gap-1 w-10/12'>
            <Input
              type='text'
              placeholder={i18n.t('form.placeholder.title')}
              name='label'
              icon='245'
              id={`in-form-${getForm.value.id}-format-title`}
              value={getForm.value.label}
              onChange={handleFormatInputChange}
            />
            <Input
              type='text'
              placeholder={i18n.t('form.placeholder.description')}
              name='description'
              icon='123'
              id={`in-form-${getForm.value.id}-format-description`}
              value={getForm.value.description}
              onChange={handleFormatInputChange}
            />
          </div>
          <Button
            name='bnt-create-form'
            type='button'
            label={i18n.t(
              getFormMode.value.mode === FORMAT_MODE_SERVICE.UPDATE
                ? 'form.btn.update'
                : 'form.btn.create'
            )}
            icon='212'
            onClick={saveFormat}
          />
        </div>
        <div className='flex flex-col w-[98%] 2xl:max-w-[60vw]'>
          {getForm.value.pages.map((page) => (
            <div key={page.id} className='w-full mb-5'>
              <Input
                type='text'
                placeholder={i18n.t('form.placeholder.title_page')}
                name='label'
                id={`in-form-${page.id}-page-title`}
                data-pageid={page.id}
                value={page.label}
                onChange={handlePageInputChange}
                icon='064'
              />
              <div className='mt-2 w-full rounded-xl border-2 border-b-light-dark dark:border-b-dark-light'>
                <table class='w-full text-left px-2'>
                  <thead className='border-b-2 border-b-light-dark dark:border-b-dark-light'>
                    <tr>
                      <th className='py-1 px-2 rounded-tl-md'>
                        {i18n.t('form.field.question')}
                      </th>
                      <th className='py-1 rounded-tr-md'>
                        {i18n.t('form.field.type')}
                      </th>
                    </tr>
                  </thead>
                  <DndProvider backend={HTML5Backend}>
                    <tbody>
                      {page.elements.map((element, index) => (
                        <FormElement
                          key={element.id}
                          question={element}
                          page={page.id}
                          index={index}
                          selected={validateSelectedElement(element.id)}
                          onSelect={handleSelect}
                          onDelete={removeElement}
                        />
                      ))}
                    </tbody>
                  </DndProvider>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div class='sticky top-1/2 -translate-y-1/2 h-44 w-[400px] justify-center hidden 2xl:flex'>
        <FormPhoneViewer />
      </div>
      <ListFormModal onSelected={onSelectedList} />
    </section>
  );
};
