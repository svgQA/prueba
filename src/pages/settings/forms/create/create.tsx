import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  addElement,
  addPage,
  removeElement,
  addSection,
  setPhonePage,
  setSelectedElement,
  validateSelectedElement,
  getForm,
  getSelectedElement,
  updateForm,
  udpateGeneralForm,
  updatePageForm,
  getFormMode,
  FORMAT_MODE_SERVICE,
} from './store';
import { FormPhoneViewer, FormElement } from './components';
import { TargetedEvent } from 'preact/compat';
import { Button, Input } from '@/components/common';
import { FormButton } from '@/components/compose';
import { FormService } from '@/services';
import { IFormRequest, IListResponse } from '@/types/form';
import { ListFormModal } from '../lists/lists';
import { getStatusElementSelected, toggleListModal } from '../lists/store';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

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
      description: getForm.value.description || getForm.value.label,
      structure: getForm.value,
    };
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
        <div className='flex flex-row w-full items-center mb-4 pr-3'>
          <div className='w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer border-b-dark-light dark:border-b-light-dark'>
            <span className='vx-icon vx-upload text-gray-400 text-2xl' />
          </div>
          <div className='flex flex-col gap-1 w-10/12'>
            <Input
              type='text'
              placeholder='Enter title'
              name='label'
              icon='245'
              id={`in-form-${getForm.value.id}-format-title`}
              value={getForm.value.label}
              onChange={handleFormatInputChange}
              borderless
            />
            <Input
              type='text'
              placeholder='Enter description'
              name='description'
              icon='123'
              id={`in-form-${getForm.value.id}-format-description`}
              borderless
              value={getForm.value.description}
              onChange={handleFormatInputChange}
            />
          </div>
          <Button
            name='bnt-create-form'
            type='button'
            label={
              getFormMode.value.mode === FORMAT_MODE_SERVICE.UPDATE
                ? 'Update'
                : 'Create'
            }
            icon='212'
            onClick={saveFormat}
          />
        </div>
        <div className='flex flex-col w-[98%] 2xl:max-w-[60vw]'>
          {getForm.value.pages.map((page) => (
            <div key={page.id} className='w-full mb-5'>
              <Input
                type='text'
                placeholder='Enter title page'
                name='label'
                id={`in-form-${page.id}-page-title`}
                data-pageid={page.id}
                value={page.label}
                onChange={handlePageInputChange}
                borderless
                icon='064'
              />
              <div className='mt-2 w-full rounded-xl border-2 border-b-light-dark dark:border-b-dark-light'>
                <table class='w-full text-left px-2'>
                  <thead className='border-b-2 border-b-light-dark dark:border-b-dark-light'>
                    <tr>
                      <th className='py-1 px-2 rounded-tl-md'>Question</th>
                      <th className='py-1 rounded-tr-md'>Type of Response</th>
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
