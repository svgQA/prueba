import { Input, Select } from '@/components/common';
import { Checkbox } from '@/components/common/checkbox/checkbox';
import { Radio } from '@/components/common/radio/radio';
import { TextArea } from '@/components/common/text.area/text.area';
import { ELEMENT_TYPE, IElement, IFormat } from '@/types/form';
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

  const renderElement = (element: IElement) => {
    // const commonClasses =
    //   'w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500';

    switch (element.type) {
      case ELEMENT_TYPE.SECTION:
        const isExpanded = expandedSections.includes(element.id);
        return (
          <div class='mb-4 bg-b-light-dark dark:bg-b-dark-light'>
            <span />
            <button
              onClick={() => toggleSection(element.id)}
              class='w-full flex justify-between items-center p-4 rounded-lg'
            >
              <span class='font-medium'>{element.label}</span>
              <span class='transform transition-transform duration-200'>
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
            {isExpanded && element.elements && (
              <div class='pl-4 mt-2'>
                {element.elements.map((el) => renderElement(el))}
              </div>
            )}
          </div>
        );
      case ELEMENT_TYPE.TITLE:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <h2 class='text-xl font-bold'>{element.label}</h2>
          </div>
        );
      case ELEMENT_TYPE.INPUT:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <Input
              name={element.id}
              type='text'
              label={element.label}
              icon='123'
              borderless
            />
          </div>
        );
      case ELEMENT_TYPE.TEXT_AREA:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <TextArea name={element.id} label={element.label} icon='123' />
          </div>
        );
      case ELEMENT_TYPE.NUMBER_INPUT:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <Input
              name={element.id}
              type='number'
              label={element.label}
              icon='123'
              borderless
            />
          </div>
        );
      case ELEMENT_TYPE.DROPDOWN:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <Select
              name={element.id}
              options={element?.options}
              label={element.label}
              icon='123'
              borderless
            />
          </div>
        );
      case ELEMENT_TYPE.RADIO_BUTTON:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <Radio
              name={element.id}
              label={element.label}
              options={element.options}
            />
          </div>
        );
      case ELEMENT_TYPE.CHECK_BOX:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <Checkbox
              name={element.id}
              label={element.label}
              options={element.options}
            />
          </div>
        );
      default:
        return (
          <div class='mb-4 p-4 rounded-lg bg-b-light-dark dark:bg-b-dark-light'>
            <label class='block text-sm font-medium text-gray-700 mb-1'>
              {element.label}
            </label>
            {element.description && (
              <p class='text-sm text-gray-500 mb-2'>{element.description}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div class='max-w-4xl mx-auto p-4'>
      <h1 class='text-2xl font-bold mb-6'>{format.label}</h1>

      {format.description && (
        <p class='text-gray-600 mb-8'>{format.description}</p>
      )}

      <div class='mb-6'>
        <h2 class='text-xl font-bold pb-2 mb-2 border-b border-gray-300'>
          {format.pages[currentPage].label}
        </h2>
        {format.pages[currentPage].elements.map((element) =>
          renderElement(element)
        )}
      </div>

      <div class='flex justify-between items-center'>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          class='px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        <span class='text-sm text-gray-600'>
          Page {currentPage + 1} of {format.pages.length}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(format.pages.length - 1, prev + 1)
            )
          }
          disabled={currentPage === format.pages.length - 1}
          class='px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>
    </div>
  );
};
