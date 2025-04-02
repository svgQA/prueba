import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'preact/hooks';

interface MentionOption {
  label: string;
  id: string;
  groupName: string;
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
  placeholder = '',
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
    (option: MentionOption) => {
      if (!editorRef.current) return;

      const span = document.createElement('span');
      span.textContent = `@${option.label}`;
      span.contentEditable = 'false';
      span.style.background = '#DAF3F7';
      span.style.color = '#00BDD6';
      span.style.padding = '2px 6px';
      span.style.borderRadius = '9999px';
      span.style.marginRight = '4px';
      span.setAttribute('data-id', option.id);
      span.setAttribute('data-label', option.label);
      span.setAttribute('data-group', option.groupName);

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

        const coords = getCaretCoordinatesInContentEditable();
        if (coords) setDropdownPos(coords);
      } else {
        setShowDropdown(false);
      }

      onChange(editorRef.current?.innerHTML || '');
    }, 50);
  }, [getCaretCoordinatesInContentEditable, onChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showDropdown) return;

      const totalOptions = expandedGroup
        ? filteredOptionsByGroup[expandedGroup]?.length || 0
        : filteredOptions.length + Object.keys(filteredOptionsByGroup).length;

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
              // Si estamos en un resultado filtrado, expandir su grupo
              const option = filteredOptions[selectedIndex];
              if (option) {
                setExpandedGroup(option.groupName);
                setSelectedIndex(0);
              }
            } else {
              // Si estamos en un grupo, expandirlo
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
            // Restaurar el índice al grupo correspondiente
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
            if (selectedIndex < filteredOptions.length) {
              // Seleccionar un resultado filtrado
              const option = filteredOptions[selectedIndex];
              if (option) {
                insertMention(option);
              }
            } else {
              // Expandir un grupo
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
            // Restaurar el índice al grupo correspondiente
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
      filteredOptions,
      filteredOptionsByGroup,
      selectedIndex,
      expandedGroup,
      insertMention,
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

  return (
    <div className='relative w-full'>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full min-h-[100px] p-3 text-sm border border-gray-300 rounded-md focus:outline-none resize-y ${className}`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          outline: 'none',
        }}
      ></div>

      {showDropdown && (
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
                  key={option.id}
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
                      key={option.id}
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
                            key={option.id}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};
