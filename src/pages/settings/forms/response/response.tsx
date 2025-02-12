import { type FunctionComponent } from 'preact';
import { ELEMENT_TYPE, IElement, IRElement } from '@/types/form';
import { Checkbox } from '@/components/common/checkbox/checkbox';
import { Radio } from '@/components/common/radio/radio';
import { TextArea } from '@/components/common/text.area/text.area';
import { TargetedEvent, useState } from 'preact/compat';
import { getResponse, getResponseMode, updateResponse } from './store/response';
import { FormService } from '@/services';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { File } from '@/components/common/file/file';
import { Input } from '@/components/common/input/input';
import { Select } from '@/components/common/select/select';
import { Button } from '@/components/common/button/button';
import { handleChange } from '@/components/utils/input';

export const FormResponseSettingPage: FunctionComponent = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [_, navigate] = useLocation();

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev: any) =>
      prev.includes(sectionId)
        ? prev.filter((id: string) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleInputChange = (
    e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const model = handleChange(e);
    if (!model.page) return;
    updateResponse(
      model.value,
      model.name,
      model.page,
      model.section,
      model.calue
    );
  };

  const renderElement = (
    element: IRElement,
    page?: string,
    section?: string
  ) => {
    switch (element.type) {
      case ELEMENT_TYPE.SECTION:
        const isExpanded = expandedSections.includes(element.id);
        return (
          <div class='mb-4 bg-b-light dark:bg-b-dark'>
            <span />
            <button
              onClick={() => toggleSection(element.id)}
              class='w-full flex justify-between items-center p-4 rounded-lg border-0'
            >
              <span class='font-medium'>{element.label}</span>
              <span class='transform transition-transform duration-200'>
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
            {isExpanded && element.elements && (
              <div class='pl-4 mt-2'>
                {element.elements.map((el: IElement) =>
                  renderElement(el, page, element.id)
                )}
              </div>
            )}
          </div>
        );
      case ELEMENT_TYPE.TITLE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <h2 class='text-xl font-bold'>{element.label}</h2>
          </div>
        );
      case ELEMENT_TYPE.INPUT:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Input
              name={element.id}
              type='text'
              label={element.label}
              icon='123'
              borderless
              value={element.value}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );
      case ELEMENT_TYPE.TEXT_AREA:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <TextArea
              name={element.id}
              label={element.label}
              icon='123'
              borderless
              value={element.value}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );
      case ELEMENT_TYPE.NUMBER_INPUT:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Input
              name={element.id}
              type='number'
              label={element.label}
              icon='123'
              borderless
              value={element.value}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );
      case ELEMENT_TYPE.DROPDOWN:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Select
              name={element.id}
              options={element?.options}
              label={element.label}
              icon='123'
              borderless
              value={element.value}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );
      case ELEMENT_TYPE.RADIO_BUTTON:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Radio
              name={element.id}
              label={element.label}
              options={element.options}
              value={element.value}
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );
      case ELEMENT_TYPE.CHECK_BOX:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <Checkbox
              name={element.id}
              label={element.label}
              options={element.options}
              onChange={handleInputChange}
              value={element.value}
              data-page={page}
              data-section={section}
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );
      case ELEMENT_TYPE.IMAGE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <File
              name={element.id}
              onChange={handleInputChange}
              data-page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              accept='image/*'
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );
      case ELEMENT_TYPE.FILES:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <File
              name={element.id}
              onChange={handleInputChange}
              data-page={page}
              value={element.value}
              label={element.label}
              data-section={section}
              accept=':not(image/*),.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv'
              disabled={getResponseMode.value?.hold}
            />
          </div>
        );

      default:
        return;
        {
          /*(
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            {element.type}
            <label class='block text-sm font-medium mb-1'>
              {element.label}
            </label>
            {element.description && (
              <p class='text-sm mb-2'>{element.description}</p>
            )}
          </div>
        );
        */
        }
    }
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const postPage = () => {
    if (!getResponse.value) return;
    const value = getResponse.value.pages.length - 1;
    setCurrentPage((prev) => Math.min(value, prev + 1));
  };

  const getCurrentPage = () => {
    if (!getResponse.value) return;
    return getResponse.value.pages[currentPage].id;
  };

  const saveResponse = async () => {
    if (!getResponse?.value || !getResponseMode?.value?.id) return;
    const response = await FormService.update_response(
      { structure: getResponse.value },
      getResponseMode.value.id
    );
    if (!response.getStatus()) return;
    navigate(PAGES_LIST_ROUTER.dashboard.setting.forms.inspect.to);
  };

  const finishResponse = async () => {
    if (!getResponse?.value || !getResponseMode?.value?.id) return;
    const response = await FormService.finish_response(
      { structure: getResponse.value },
      getResponseMode.value.id
    );
    if (!response.getStatus()) return;
    navigate(PAGES_LIST_ROUTER.dashboard.setting.forms.inspect.to);
  };

  return (
    <section className='pt-5'>
      {getResponse.value && (
        <div className='max-w-4xl mx-auto py-4 px-8 bg-b-light-dark dark:bg-b-dark-light rounded-md'>
          <div className='w-full flex flex-row justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold mb-6'>
                {getResponse.value.label}
              </h1>

              {getResponse.value.description && (
                <p className='mb-8'>{getResponse.value.description}</p>
              )}
            </div>
            <Button
              type='button'
              onClick={finishResponse}
              name='btn-finish-response'
              icon='137'
              label='finish'
            />
            <Button
              type='button'
              onClick={saveResponse}
              name='btn-save-response'
              icon='134'
              label='save'
            />
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-bold pb-2 mb-2 border-b border-gray-300'>
              {getResponse.value.pages[currentPage].label}
            </h2>
            {getResponse.value.pages[currentPage].elements.map((element) =>
              renderElement(element, getCurrentPage())
            )}
          </div>

          <div className='flex justify-between items-center'>
            <Button
              name='btn-response-prev'
              type='button'
              label='previus'
              icon='003'
              onClick={prevPage}
            />
            <span className='text-sm'>
              Page {currentPage + 1} of {getResponse.value.pages.length}
            </span>
            <Button
              name='btn-response-next'
              type='button'
              label='next'
              icon='004'
              end
              disabled={currentPage === getResponse.value.pages.length - 1}
              onClick={postPage}
            />
          </div>
        </div>
      )}
    </section>
  );
};
