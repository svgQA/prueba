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
  onMouseDown?: (event: MouseEvent) => void;
};

/*
Posibles problemas:
1. El texto se está seleccionando porque SVG no previene la selección por defecto
2. Múltiples elementos text pueden estar superpuestos causando problemas de selección
3. No hay manejo específico para evitar la propagación de eventos

Soluciones potenciales:
1. Agregar CSS para prevenir la selección de texto: user-select: none
2. Utilizar pointer-events para controlar qué elementos responden a eventos del mouse
3. Implementar stopPropagation en los eventos del mouse
4. Considerar usar un id único para cada clipPath para evitar conflictos
*/

export const BarDisplay: FunctionComponent<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  progressX,
  progressWidth,
  barCornerRadius,
  isSelected,
  styles,
  // onMouseDown,
  name,
}) => {
  // const getProcessColor = () => {
  // 	return isSelected ? styles.progressSelectedColor : styles.progressColor;
  // };

  const getRandomPastelHex = () => {
    // Generamos un color pastel en HSL
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.random() * 10; // 60–70%
    const lightness = 80 + Math.random() * 10; // 80–90%

    // Convertimos HSL a RGB
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l; // gris
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    // Convertimos RGB a HEX
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  /*
  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };
  */

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : getRandomPastelHex();
  };

  return (
    <g
    // onMouseDown={onMouseDown}
    >
      <rect
        x={x}
        width={width > 32 ? width : 33}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        stroke='black'
        stroke-width={2}
        // fill='red'
        fill={getBarColor()}
        // className='border border-t-emerald-700'
      />
      {/*
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
    */}
      {width > 40 && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={width - 40}
          height={height}
          x={x + 34}
          y={y}
        >
          <text y={height / 1.7}>{name} LA PUTA</text>
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
