import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  addElement,
  addPage,
  format,
  removeElement,
  addSection,
  setPhonePage,
  setSelectedElement,
  getSelectedElement,
  validateSelectedElement,
  getForm,
} from './store';
import { FormPhoneViewer, FormElement } from './components';
import { TargetedEvent } from 'preact/compat';
import { Button, Input } from '@/components/common';
import { FormButton } from '@/components/compose';
import { FormService } from '@/services';
import { IFormRequest } from '@/types/form';

export const FormCreateSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Forms Create Settings';
  }, []);

  const handleSelect = (id: string, page: string, section?: string) => {
    if (id === getSelectedElement.value?.id) return;
    setSelectedElement({ id, page, section });
    const pageIndex = format.value.pages.findIndex((p) => p.id === page);
    if (pageIndex >= 0) {
      setPhonePage(pageIndex);
    }
  };

  const showFormat = async () => {
    const format: IFormRequest = {
      title: getForm.value.label,
      description: getForm.value.description || getForm.value.label,
      structure: getForm.value,
    };
    const response = await FormService.create(format);

    if (!response.getStatus()) return;
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
    format.value = {
      ...format.value,
      [name]: value,
    };
  };

  const handlePageInputChange = (e: TargetedEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const pageId = e.currentTarget.getAttribute('data-pageid');
    if (!pageId) return;

    format.value = {
      ...format.value,
      pages: format.value.pages.map((page) =>
        page.id === pageId ? { ...page, [name]: value } : page
      ),
    };
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
        <div className='flex flex-row w-full items-center mb-4'>
          <div className='w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer border-b-dark-light dark:border-b-light-dark'>
            <span className='vx-icon vx-upload text-gray-400 text-2xl' />
          </div>
          <div className='flex flex-col gap-1  w-8/12'>
            <Input
              type='text'
              placeholder='Enter title'
              name='label'
              icon='245'
              id={`in-form-${format.value.id}-format-title`}
              value={format.value.label}
              onChange={handleFormatInputChange}
              borderless
            />
            <Input
              type='text'
              placeholder='Enter description'
              name='description'
              icon='123'
              id={`in-form-${format.value.id}-format-description`}
              borderless
              value={format.value.description}
              onChange={handleFormatInputChange}
            />
          </div>
          <Button
            name='bnt-create-form'
            type='button'
            label='Create'
            icon='212'
            onClick={showFormat}
          />
        </div>
        <div className='flex flex-col w-[98%] 2xl:max-w-[60vw]'>
          {format.value.pages.map((page) => (
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
    </section>
  );
};
