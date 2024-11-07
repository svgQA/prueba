import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addElement, addPage, format, removeElement } from './store';
import { FormPhoneViewer, FormElement } from './components';
import { useSignal } from '@preact/signals';
import { TargetedEvent } from 'preact/compat';

interface ISelected {
  id: string;
  page: string;
}

export const FormCreateSettingPage: FunctionComponent = () => {
  const selectedElement = useSignal<ISelected | null>(null);
  useEffect(() => {
    document.title = 'Forms Create Settings';
  }, []);

  const showElements = () => {
    console.log(format.value);
  };

  const handleSelect = (id: string, page: string) => {
    if (id === selectedElement.value?.id) return;
    selectedElement.value = { id, page };
  };

  const addLelement = () => {
    if (!selectedElement.value) return;
    addElement(selectedElement.value.page);
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
          <div className='flex flex-row w-full gap-4 my-2'>
            <div className='w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer'>
              <span className='vx-icon vx-upload text-gray-400 text-2xl' />
            </div>
            <div className='flex-1'>
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
                className='w-full text-lg text-gray-600 p-2 border border-gray-200 rounded'
                placeholder='Enter description'
                name='description'
                value={format.value.description}
                onChange={handleFormatInputChange}
              />
            </div>
          </div>
          {/* START: Append menus */}
          <div
            className={`${selectedElement.value ? 'visible' : 'invisible'} absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10 bg-white p-1 shadow-md border-2 rounded-md`}
          >
            <div
              class='bg-blue-500 vx-form-actions-button'
              onClick={addLelement}
            >
              <span className='vx-icon vx-users' />
              <h6>Element</h6>
            </div>
            <div
              class='bg-gray-600 vx-form-actions-button'
              onClick={showElements}
            >
              <span className='vx-icon vx-gateway' />
              <h6>Section</h6>
            </div>
            <div class='bg-teal-500 vx-form-actions-button' onClick={addPage}>
              <span className='vx-icon vx-sensor' />
              <h6>Page</h6>
            </div>
          </div>
          {/* START: Sesiones */}
          <div className='flex flex-col w-8/12 '>
            {format.value.pages.map((page) => (
              <div key={page.id} className='w-full mb-5'>
                <div className='flex-1'>
                  <input
                    type='text'
                    className='w-full text-xl font-bold mb-2 p-2 border border-gray-200 rounded'
                    placeholder='Enter title page'
                    name='label'
                    data-pageid={page.id}
                    value={page.label}
                    onChange={handlePageInputChange}
                  />
                </div>
                <DndProvider backend={HTML5Backend}>
                  <table class='w-full text-left relative'>
                    <thead className='bg-red'>
                      <tr className='bg-gray-200 rounded-t-2 text-gray-600'>
                        <th className='py-1 px-2 rounded-tl-md'>Question</th>
                        <th className='py-1 rounded-tr-md'>Type of Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.elements.map((element, index) => (
                        <FormElement
                          key={element.id}
                          question={element}
                          page={page.id}
                          index={index}
                          selected={selectedElement.value?.id === element.id}
                          onSelect={handleSelect}
                          onDelete={removeElement}
                        />
                      ))}
                    </tbody>
                  </table>
                </DndProvider>
              </div>
            ))}
          </div>
        </div>
        <FormPhoneViewer />
      </div>
    </section>
  );
};
