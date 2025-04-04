import { FunctionComponent } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { ITooltipProps } from './interface';

export const Tooltip: FunctionComponent<ITooltipProps> = ({
  text,
  position = 'right',
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const positionTooltip = (): void => {
      if (!tooltipRef.current || !contentRef.current) return;
      const content = contentRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current;

      switch (position) {
        case 'top':
          tooltip.style.bottom = `${content.height}px`;
          tooltip.style.left = '50%';
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'bottom':
          tooltip.style.top = `${content.height}px`;
          tooltip.style.left = '50%';
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'left':
          tooltip.style.right = `${content.width}px`;
          tooltip.style.top = '50%';
          tooltip.style.transform = 'translateY(-50%)';
          break;
        case 'right':
          tooltip.style.left = `${content.width}px`;
          tooltip.style.top = '50%';
          tooltip.style.transform = 'translateY(-50%)';
          break;
      }
    };

    if (isVisible) {
      positionTooltip();
    }
  }, [isVisible, position]);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div ref={contentRef}>{children}</div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-2 py-1 
            text-sm bg-primary text-white
            rounded shadow-lg whitespace-nowrap
            transition-opacity duration-200
            ${position === 'top' ? 'mb-1' : ''}
            ${position === 'bottom' ? 'mt-1' : ''}
            ${position === 'left' ? 'mr-1' : ''}
            ${position === 'right' ? 'ml-1' : ''}
          `}
        >
          {text}
          <div
            className={`
              absolute w-2 h-2 bg-primary transform rotate-45
              ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

// Example usage:
/*
import { Tooltip } from './tooltip';

// Basic usage with default position (top)
<Tooltip text="This is a helpful tooltip">
  <button>Hover me</button>
</Tooltip>

// With custom position
<Tooltip 
  text="Tooltip appears on the right"
  position="right"
>
  <span>Hover for more info</span>
</Tooltip>

// With custom className
<Tooltip
  text="Custom styled tooltip"
  position="bottom"
  className="my-custom-class"
>
  <div>Hover over this element</div>
</Tooltip>
*/
