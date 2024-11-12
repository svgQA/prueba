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
  existSelectedElement,
  getForm,
} from './store';
import { FormPhoneViewer, FormElement } from './components';
import { TargetedEvent } from 'preact/compat';

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

  const showFormat = () => {
    console.log(getForm.value);
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
    <section className='h-full'>
      <div className='flex flex-row relative'>
        <div className='pl-20 pr-9 w-full flex flex-col h-[80vh] overflow-y-scroll vox-scroll-design'>
          {/* START: Titles */}
          <div className='flex flex-row 2xl:w-8/12 w-full my-5 items-center'>
            <div className='w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer border-b-dark-light dark:border-b-light-dark'>
              <span className='vx-icon vx-upload text-gray-400 text-2xl' />
            </div>
            <div className='flex-1 ml-4'>
              <input
                type='text'
                className='w-full text-2xl font-bold mb-2 p-2 border border-gray-200 rounded'
                placeholder='Enter title'
                name='label'
                value={format.value.label}
                onChange={handleFormatInputChange}
              />
              <input
                type='text'
                className='w-full text-lg p-2 rounded'
                placeholder='Enter description'
                name='description'
                value={format.value.description}
                onChange={handleFormatInputChange}
              />
            </div>
            <button
              id='bt-create-element'
              name='bt-create-element'
              className='h-fit'
              type='button'
              onClick={showFormat}
            >
              Create
            </button>
          </div>
          {/* START: Append menus */}
          <div
            className={`${existSelectedElement.value ? 'visible' : 'invisible'} absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10 p-1 rounded-md`}
          >
            <div
              class='bg-ternary vx-form-actions-button'
              onClick={addLelement}
            >
              <span className='vox-icon vx-icon-245' />
              <h6>Element</h6>
            </div>
            <div
              class='bg-primary vx-form-actions-button'
              onClick={addLsection}
            >
              <span className='vox-icon vx-icon-274' />
              <h6>Section</h6>
            </div>
            <div class='bg-ternary vx-form-actions-button' onClick={addPage}>
              <span className='vox-icon vx-icon-064' />
              <h6>Page</h6>
            </div>
          </div>
          {/* START: Sesiones */}
          <div className='flex flex-col 2xl:w-8/12 w-full'>
            {format.value.pages.map((page) => (
              <div key={page.id} className='w-full mb-5'>
                <div className='flex-1'>
                  <input
                    type='text'
                    className='w-full text-xl font-bold mb-2 p-2 border rounded'
                    placeholder='Enter title page'
                    name='label'
                    data-pageid={page.id}
                    value={page.label}
                    onChange={handlePageInputChange}
                  />
                </div>
                <table class='w-full text-left relative border-2'>
                  <thead>
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
            ))}
          </div>
        </div>
        <div className='hidden 2xl:block'>
          <FormPhoneViewer />
        </div>
      </div>
    </section>
  );
};
