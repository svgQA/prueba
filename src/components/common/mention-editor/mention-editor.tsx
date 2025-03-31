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
}

interface MentionEditorProps {
  value: string;
  onChange: (html: string) => void;
  options: MentionOption[];
  placeholder?: string;
  className?: string;
}

export const MentionEditor = ({
  value,
  onChange,
  options,
  placeholder = '',
  className = '',
}: MentionEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const debounceTimer = useRef<number>();

  // Memoize filtered options
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

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
    // Debounce the input handling
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

        const coords = getCaretCoordinatesInContentEditable();
        if (coords) setDropdownPos(coords);
      } else {
        setShowDropdown(false);
      }

      onChange(editorRef.current?.innerHTML || '');
    }, 50); // 50ms debounce
  }, [getCaretCoordinatesInContentEditable, onChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showDropdown) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (filteredOptions[selectedIndex]) {
            insertMention(filteredOptions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowDropdown(false);
          break;
      }
    },
    [showDropdown, filteredOptions, selectedIndex, insertMention]
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
        className={`w-full min-h-[100px] p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y ${className}`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          outline: 'none',
        }}
      ></div>

      {showDropdown && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className='fixed z-50 bg-white rounded-md border rounded-md overflow-y-auto vox-scroll-design'
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            minWidth: '200px',
            maxHeight: '220px',
          }}
        >
          {filteredOptions.map((option, index) => (
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
      )}
    </div>
  );
};
