import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'preact/hooks';
import { IOption } from '@/components/common/multi/interface';

export interface MentionOption extends IOption {
  groupName?: string;
}

interface MentionGroup {
  name: string;
  options: MentionOption[];
}

interface MentionEditorProps {
  value: string;
  onChange: (html: string) => void;
  groups: MentionGroup[];
  placeholder?: string;
  className?: string;
}

export const MentionEditor = ({
  value,
  onChange,
  groups,
  // placeholder = '',
  className = '',
}: MentionEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const debounceTimer = useRef<number>();

  // Memoize all options with group information
  const allOptions = useMemo(() => {
    return groups.flatMap((group) =>
      group.options.map((option) => ({
        ...option,
        groupName: group.name,
      }))
    );
  }, [groups]);

  // Memoize filtered options
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return [];
    return allOptions.filter((o) =>
      o.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allOptions, searchTerm]);

  // Memoize filtered options by group
  const filteredOptionsByGroup = useMemo(() => {
    const result: Record<string, MentionOption[]> = {};

    groups.forEach((group) => {
      const filtered = group.options.filter((o) =>
        o.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filtered.length > 0) {
        result[group.name] = filtered;
      }
    });

    return result;
  }, [groups, searchTerm]);

  // Memoize total options count
  const totalOptions = useMemo(() => {
    return expandedGroup
      ? filteredOptionsByGroup[expandedGroup]?.length || 0
      : filteredOptions.length + Object.keys(filteredOptionsByGroup).length + 1; // +1 para la opción de fecha
  }, [expandedGroup, filteredOptions.length, filteredOptionsByGroup]);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const getCaretCoordinatesInContentEditable = useCallback((): {
    top: number;
    left: number;
  } | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0).cloneRange();
    const span = document.createElement('span');
    span.textContent = '\u200b';
    range.insertNode(span);

    const rect = span.getBoundingClientRect();
    const top = rect.top + window.scrollY + 20;
    const left = rect.left + window.scrollX;

    span.remove();
    return { top, left };
  }, []);

  const insertMention = useCallback(
    (option: MentionOption | { type: 'date'; value: string }) => {
      if (!editorRef.current) return;

      const span = document.createElement('span');
      if ('type' in option && option.type === 'date') {
        span.textContent = `@${option.value}`;
        span.style.background = '#E6F4EA';
        span.style.color = '#137333';
        span.setAttribute('data-type', 'date');
        span.setAttribute('data-value', String(option.value));
      } else {
        const mentionOption = option as MentionOption;
        span.textContent = `@${mentionOption.label}`;
        span.style.background = '#DAF3F7';
        span.style.color = '#00BDD6';
        span.setAttribute('data-id', String(mentionOption.value));
        span.setAttribute('data-label', mentionOption.label);
        span.setAttribute('data-group', mentionOption.groupName || '');
      }
      span.contentEditable = 'false';
      span.style.padding = '2px 6px';
      span.style.borderRadius = '9999px';
      span.style.marginRight = '4px';

      const spaceNode = document.createTextNode('\u00A0');

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      const offset = range.startOffset;

      const textNode = node.nodeType === 3 ? node : node.childNodes[0];
      const text = textNode.textContent || '';
      const match = text.slice(0, offset).match(/@(\w*)$/);

      if (match) {
        const matchLength = match[0].length;
        const newText = text.slice(0, offset - matchLength);
        textNode.textContent = newText + text.slice(offset);

        const newRange = document.createRange();
        newRange.setStart(textNode, newText.length);
        newRange.setEnd(textNode, newText.length);
        newRange.deleteContents();

        newRange.insertNode(spaceNode);
        newRange.insertNode(span);

        const finalRange = document.createRange();
        finalRange.setStartAfter(spaceNode);
        finalRange.collapse(true);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(finalRange);
      }

      setShowDropdown(false);
      setShowDatePicker(false);
      setSearchTerm('');
      onChange(editorRef.current.innerHTML);
    },
    [onChange]
  );

  const handleInput = useCallback(() => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      const text = range.startContainer.textContent || '';
      const before = text.slice(0, range.startOffset);
      const match = before.match(/@(\w*)$/);

      if (match) {
        const term = match[1];
        setSearchTerm(term);
        setSelectedIndex(0);
        setShowDropdown(true);
        setExpandedGroup(null);
        setShowDatePicker(false);

        const coords = getCaretCoordinatesInContentEditable();
        if (coords) setDropdownPos(coords);
      } else {
        setShowDropdown(false);
        setShowDatePicker(false);
      }

      onChange(editorRef.current?.innerHTML || '');
    }, 50);
  }, [getCaretCoordinatesInContentEditable, onChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showDropdown && !showDatePicker) return;

      if (showDatePicker) {
        e.preventDefault();
        const currentDate = selectedDate ? new Date(selectedDate) : new Date();

        switch (e.key) {
          case 'ArrowUp':
            currentDate.setDate(currentDate.getDate() - 7); // Retrocede una semana
            handleDateSelect(currentDate.toISOString().split('T')[0]);
            break;
          case 'ArrowDown':
            currentDate.setDate(currentDate.getDate() + 7); // Avanza una semana
            handleDateSelect(currentDate.toISOString().split('T')[0]);
            break;
          case 'ArrowLeft':
            currentDate.setDate(currentDate.getDate() - 1); // Retrocede un día
            handleDateSelect(currentDate.toISOString().split('T')[0]);
            break;
          case 'ArrowRight':
            currentDate.setDate(currentDate.getDate() + 1); // Avanza un día
            handleDateSelect(currentDate.toISOString().split('T')[0]);
            break;
          case 'Escape':
            setShowDatePicker(false);
            setShowDropdown(true);
            break;
          case 'Enter':
            if (selectedDate) {
              insertMention({ type: 'date', value: selectedDate });
            }
            break;
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => {
            const nextIndex = prev < totalOptions - 1 ? prev + 1 : 0;
            return nextIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => {
            const nextIndex = prev > 0 ? prev - 1 : totalOptions - 1;
            return nextIndex;
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!expandedGroup) {
            if (selectedIndex < filteredOptions.length) {
              const option = filteredOptions[selectedIndex];
              if (option) {
                setExpandedGroup(option.groupName);
                setSelectedIndex(0);
              }
            } else if (selectedIndex === totalOptions - 1) {
              // Si está en la opción de fecha, abrir el selector
              setShowDropdown(false);
              setShowDatePicker(true);
            } else {
              const groupIndex = selectedIndex - filteredOptions.length;
              const groupName = Object.keys(filteredOptionsByGroup)[groupIndex];
              if (groupName) {
                setExpandedGroup(groupName);
                setSelectedIndex(0);
              }
            }
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (expandedGroup) {
            setExpandedGroup(null);
            const groupNames = Object.keys(filteredOptionsByGroup);
            const groupIndex = groupNames.indexOf(expandedGroup);
            if (groupIndex !== -1) {
              setSelectedIndex(filteredOptions.length + groupIndex);
            }
          }
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (expandedGroup) {
            const option = filteredOptionsByGroup[expandedGroup][selectedIndex];
            if (option) {
              insertMention(option);
            }
          } else {
            // Verificar si se seleccionó la opción de fecha
            if (selectedIndex === totalOptions - 1) {
              setShowDropdown(false);
              setShowDatePicker(true);
              return;
            }

            if (selectedIndex < filteredOptions.length) {
              const option = filteredOptions[selectedIndex];
              if (option) {
                insertMention(option);
              }
            } else {
              const groupIndex = selectedIndex - filteredOptions.length;
              const groupName = Object.keys(filteredOptionsByGroup)[groupIndex];
              if (groupName) {
                setExpandedGroup(groupName);
                setSelectedIndex(0);
              }
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (expandedGroup) {
            setExpandedGroup(null);
            const groupNames = Object.keys(filteredOptionsByGroup);
            const groupIndex = groupNames.indexOf(expandedGroup);
            if (groupIndex !== -1) {
              setSelectedIndex(filteredOptions.length + groupIndex);
            }
          } else {
            setShowDropdown(false);
          }
          break;
      }
    },
    [
      showDropdown,
      showDatePicker,
      filteredOptions,
      filteredOptionsByGroup,
      selectedIndex,
      expandedGroup,
      insertMention,
      totalOptions,
    ]
  );

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Memoize highlight function
  const highlightMatch = useCallback(
    (label: string) => {
      if (!searchTerm) return label;
      const regex = new RegExp(`(${searchTerm})`, 'i');
      return label.replace(
        regex,
        '<mark class="bg-yellow-100 rounded px-0.5">$1</mark>'
      );
    },
    [searchTerm]
  );

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    insertMention({ type: 'date', value: date });
  };

  return (
    <div className='relative w-full'>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        // placeholder={placeholder}
        className={`w-full min-h-[100px] p-3 text-sm border border-gray-300 rounded-md focus:outline-none resize-y ${className}`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          outline: 'none',
        }}
      ></div>

      {showDropdown && !showDatePicker && (
        <div
          ref={dropdownRef}
          className='fixed z-50 bg-white select:border-node rounded-md border rounded-md overflow-y-auto vox-scroll-design'
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            minWidth: '200px',
            maxHeight: '220px',
          }}
        >
          {expandedGroup ? (
            <div>
              <div className='px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 flex items-center'>
                <button
                  className='mr-2 text-gray-500 hover:text-gray-700 border-none'
                  onClick={() => setExpandedGroup(null)}
                >
                  ←
                </button>
                {expandedGroup}
              </div>
              {filteredOptionsByGroup[expandedGroup]?.map((option, index) => (
                <button
                  key={option.value}
                  className={`block w-full px-4 py-2 text-sm text-left border-none ${
                    index === selectedIndex
                      ? 'bg-primary-opacity'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => insertMention(option)}
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(option.label),
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              {/* Most relevant results */}
              {filteredOptions.length > 0 && (
                <div className='border-b border-gray-200'>
                  <div className='px-3 py-2 text-xs text-gray-500 bg-gray-50'>
                    Resultados más relevantes
                  </div>
                  {filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      className={`block w-full px-4 py-2 text-sm text-left border-none ${
                        index === selectedIndex
                          ? 'bg-primary-opacity'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => insertMention(option)}
                    >
                      <div className='flex items-center justify-between'>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(option.label),
                          }}
                        />
                        <span className='text-xs text-gray-400'>
                          {option.groupName}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Grouped results */}
              {Object.entries(filteredOptionsByGroup).map(
                ([groupName, options], index) => (
                  <div
                    key={groupName}
                    className='relative'
                    onMouseEnter={() => setHoveredGroup(groupName)}
                    onMouseLeave={() => setHoveredGroup(null)}
                  >
                    <button
                      className={`block w-full px-4 py-2 text-sm text-left border-none ${
                        index + filteredOptions.length === selectedIndex
                          ? 'bg-primary-opacity'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setExpandedGroup(groupName);
                        setSelectedIndex(0);
                      }}
                    >
                      <div className='flex items-center justify-between'>
                        <span>{groupName}</span>
                        <span className='text-gray-400'>→</span>
                      </div>
                    </button>
                    {hoveredGroup === groupName && (
                      <div
                        className='absolute left-full top-0 bg-white rounded-md border border-gray-200 shadow-lg min-w-[200px] max-h-[220px] overflow-y-auto z-[1000]'
                        style={{
                          transform: 'translateX(4px)',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          position: 'fixed',
                          top: `${dropdownPos.top + index * 36}px`,
                          left: `${dropdownPos.left + 200}px`,
                        }}
                      >
                        <div className='px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 sticky top-0'>
                          {groupName}
                        </div>
                        {options.map((option) => (
                          <button
                            key={option.value}
                            className={`block w-full px-4 py-2 text-sm text-left border-none hover:bg-gray-100`}
                            onClick={() => insertMention(option)}
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(option.label),
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Date picker option */}
              <div className='border-t border-gray-200'>
                <button
                  className={`block w-full px-4 py-2 text-sm text-left border-none ${
                    selectedIndex === totalOptions - 1
                      ? 'bg-primary-opacity'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setShowDropdown(false);
                    setShowDatePicker(true);
                  }}
                >
                  <div className='flex items-center justify-between'>
                    <span>Seleccionar fecha</span>
                    <span className='text-gray-400'>📅</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {showDatePicker && (
        <div
          className='fixed z-50 bg-white rounded-md border border-gray-200 shadow-lg p-4'
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
          }}
        >
          <div className='flex justify-between items-center mb-2'>
            <h3 className='text-sm font-medium text-gray-700'>
              Seleccionar fecha
            </h3>
            <button
              className='text-gray-500 hover:text-gray-700 border-none'
              onClick={() => {
                setShowDatePicker(false);
                setShowDropdown(true);
              }}
            >
              ×
            </button>
          </div>
          <input
            type='date'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.currentTarget.value)}
          />
        </div>
      )}
    </div>
  );
};
