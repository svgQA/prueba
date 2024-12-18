import { Button, Input, Select } from '@/components/common';
import { Checkbox } from '@/components/common/checkbox/checkbox';
import { Radio } from '@/components/common/radio/radio';
import { TextArea } from '@/components/common/text.area/text.area';
import { ELEMENT_TYPE, IElement, IFormat } from '@/types/form';
import { TargetedEvent } from 'preact/compat';
import { useState } from 'preact/hooks';

interface FormatBuilderProps {
  format: IFormat;
}

export const ResponderBuilder = ({ format }: FormatBuilderProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  // const [responses, setResponses] = useState<{ [key: string]: any }>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // const handleInputChange = (id: string, value: any) => {
  //   setResponses((prev) => ({ ...prev, [id]: value }));
  // };

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

    const page = target.dataset.page;
    const section = target.dataset.section;

    // Aqui se tiene la informaciòn para agregar en el value
    console.log('DATOS: ', value, name, page, section);
  };

  const renderElement = (
    element: IElement,
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
                {element.elements.map((el) =>
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
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
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
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
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
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
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
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
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
              onChange={handleInputChange}
              data-page={page}
              data-section={section}
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
              data-page={page}
              data-section={section}
            />
          </div>
        );
      default:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light dark:bg-b-dark'>
            <label class='block text-sm font-medium mb-1'>
              {element.label}
            </label>
            {element.description && (
              <p class='text-sm mb-2'>{element.description}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div class='max-w-4xl mx-auto py-4 px-8 bg-b-light-dark dark:bg-b-dark-light rounded-md'>
      <h1 class='text-2xl font-bold mb-6'>{format.label}</h1>

      {format.description && <p class='mb-8'>{format.description}</p>}

      <div class='mb-6'>
        <h2 class='text-xl font-bold pb-2 mb-2 border-b border-gray-300'>
          {format.pages[currentPage].label}
        </h2>
        {format.pages[currentPage].elements.map((element) =>
          renderElement(element, format.pages[currentPage].id)
        )}
      </div>

      <div class='flex justify-between items-center'>
        <Button
          name='btn-response-prev'
          type='button'
          label='previus'
          icon='003'
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
        />
        <span class='text-sm'>
          Page {currentPage + 1} of {format.pages.length}
        </span>
        <Button
          name='btn-response-next'
          type='button'
          label='next'
          icon='004'
          end
          disabled={currentPage === format.pages.length - 1}
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(format.pages.length - 1, prev + 1)
            )
          }
        />
      </div>
    </div>
  );
};
