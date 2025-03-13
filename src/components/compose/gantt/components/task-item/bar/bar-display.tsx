import { FunctionComponent } from 'preact';

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  name?: string;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: MouseEvent) => void;
};

export const BarDisplay: FunctionComponent<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  name,
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
      />
      <g transform={`translate(${x},${y})`}>
        <rect
          width={30}
          height={height}
          ry={barCornerRadius}
          rx={barCornerRadius}
          fill={getProcessColor()}
        />
        <path
          d='M8 12C8 7.58 11.58 4 16 4C20.42 4 24 7.58 24 12C24 16.42 20.42 20 16 20C11.58 20 8 16.42 8 12ZM16 2C10.48 2 6 6.48 6 12C6 17.52 10.48 22 16 22C21.52 22 26 17.52 26 12C26 6.48 21.52 2 16 2ZM16.5 7V12.25L21 15L20.25 16.25L15 13V7H16.5Z'
          fill='white'
          transform='translate(-0.5,12)'
        />
      </g>
      {width > 40 && (
        <svg width={width - 40} height={height} x={x + 34} y={y}>
          <text y={height / 1.7}>{name}</text>
          <defs>
            <clipPath id='clip'>
              <rect width={width - 40} height={height} />
            </clipPath>
          </defs>
          <g clipPath='url(#clip)'>
            <text y={height / 1.7}>{name}</text>
          </g>
        </svg>
      )}
      <rect
        x={progressX}
        width={isNaN(progressWidth) ? 0 : progressWidth}
        y={y}
        height={height - 40}
        ry={barCornerRadius}
        rx={barCornerRadius}
        className='fill-green-700'
        opacity='0.7'
      />
    </g>
  );
};
