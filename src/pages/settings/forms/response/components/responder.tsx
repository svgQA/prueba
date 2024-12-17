import { ELEMENT_TYPE, IElement, IFormat } from '@/types/form';
import { useState } from 'preact/hooks';

interface FormatBuilderProps {
  format: IFormat;
}

export const ResponderBuilder = ({ format }: FormatBuilderProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleInputChange = (id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const renderElement = (element: IElement) => {
    const commonClasses =
      'w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500';

    switch (element.type) {
      case ELEMENT_TYPE.SECTION:
        const isExpanded = expandedSections.includes(element.id);
        return (
          <div class='mb-4'>
            <button
              onClick={() => toggleSection(element.id)}
              class='w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg'
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
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
            <h2 class='text-xl font-bold'>{element.label}</h2>
          </div>
        );
      case ELEMENT_TYPE.INPUT:
        return (
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
            <label class='block text-sm font-medium text-gray-700 mb-1'>
              {element.label}{' '}
              {element.required && <span class='text-red-500'>*</span>}
            </label>
            {element.description && (
              <p class='text-sm text-gray-500 mb-2'>{element.description}</p>
            )}
            <input
              type='text'
              class={commonClasses}
              value={responses[element.id] || element.default || ''}
              onChange={(e) =>
                handleInputChange(element.id, e.currentTarget.value)
              }
              pattern={element.regex}
              maxLength={element.max}
              required={element.required}
              disabled={element.disable}
            />
          </div>
        );
      case ELEMENT_TYPE.TEXT_AREA:
        return (
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
            <label class='block text-sm font-medium text-gray-700 mb-1'>
              {element.label}{' '}
              {element.required && <span class='text-red-500'>*</span>}
            </label>
            {element.description && (
              <p class='text-sm text-gray-500 mb-2'>{element.description}</p>
            )}
            <textarea
              class={commonClasses}
              value={responses[element.id] || element.default || ''}
              onChange={(e) =>
                handleInputChange(element.id, e.currentTarget.value)
              }
              maxLength={element.max}
              required={element.required}
              disabled={element.disable}
            />
          </div>
        );
      case ELEMENT_TYPE.NUMBER_INPUT:
        return (
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
            <label class='block text-sm font-medium text-gray-700 mb-1'>
              {element.label}{' '}
              {element.required && <span class='text-red-500'>*</span>}
            </label>
            {element.description && (
              <p class='text-sm text-gray-500 mb-2'>{element.description}</p>
            )}
            <input
              type='number'
              class={commonClasses}
              value={responses[element.id] || element.default || ''}
              onChange={(e) =>
                handleInputChange(element.id, Number(e.currentTarget.value))
              }
              min={element.min}
              max={element.max}
              required={element.required}
              disabled={element.disable}
            />
          </div>
        );
      case ELEMENT_TYPE.DROPDOWN:
        return (
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
            <label class='block text-sm font-medium text-gray-700 mb-1'>
              {element.label}{' '}
              {element.required && <span class='text-red-500'>*</span>}
            </label>
            {element.description && (
              <p class='text-sm text-gray-500 mb-2'>{element.description}</p>
            )}
            <select
              class={commonClasses}
              value={responses[element.id] || element.default || ''}
              onChange={(e) =>
                handleInputChange(element.id, e.currentTarget.value)
              }
              required={element.required}
              disabled={element.disable}
            >
              <option value=''>Select an option</option>
              {element.options?.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        );
      case ELEMENT_TYPE.RADIO_BUTTON:
        return (
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
            <label class='block text-sm font-medium text-gray-700 mb-1'>
              {element.label}{' '}
              {element.required && <span class='text-red-500'>*</span>}
            </label>
            {element.description && (
              <p class='text-sm text-gray-500 mb-2'>{element.description}</p>
            )}
            <div class='space-y-2'>
              {element.options?.map((option) => (
                <label class='flex items-center space-x-2'>
                  <input
                    type='radio'
                    name={element.id}
                    value={option.value}
                    checked={responses[element.id] === option.value}
                    onChange={(e) =>
                      handleInputChange(element.id, e.currentTarget.value)
                    }
                    required={element.required}
                    disabled={element.disable}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case ELEMENT_TYPE.CHECK_BOX:
        return (
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
            <label class='block text-sm font-medium text-gray-700 mb-1'>
              {element.label}{' '}
              {element.required && <span class='text-red-500'>*</span>}
            </label>
            {element.description && (
              <p class='text-sm text-gray-500 mb-2'>{element.description}</p>
            )}
            <div class='space-y-2'>
              {element.options?.map((option) => (
                <label class='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    value={option.value}
                    checked={responses[element.id]?.includes(option.value)}
                    onChange={(e) => {
                      const current = responses[element.id] || [];
                      const value = e.currentTarget.value;
                      handleInputChange(
                        element.id,
                        current.includes(value)
                          ? current.filter((v: string) => v !== value)
                          : [...current, value]
                      );
                    }}
                    disabled={element.disable}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div class='mb-4 p-4 bg-white rounded-lg shadow-sm'>
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
