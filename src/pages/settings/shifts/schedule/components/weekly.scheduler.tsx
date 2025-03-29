import React, { useState } from 'react';
import './style.css';
// Props para pasar los datos y las funciones de actualización
interface WeeklySchedulerProps {
  startHour?: number;
  endHour?: number;
  title?: string;
  clearSelection?: boolean;
  selectedCells: { [key: string]: boolean };
  onClearSelection: () => void;
  onCellChange: (newCells: { [key: string]: boolean }) => void;
}

const WeeklyScheduler = ({
  startHour = 0,
  endHour = 23,
  title = '',
  clearSelection = true,
  selectedCells,
  onClearSelection,
  onCellChange,
}: WeeklySchedulerProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startSelection, setStartSelection] = useState<{
    day: number;
    hour: number;
  } | null>(null);
  const daysOfWeek = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const handleMouseDown = (day: number, hour: number) => {
    setIsSelecting(true);
    setStartSelection({ day, hour });
    const newCells = {
      ...selectedCells,
      [`${day}-${hour}`]: !selectedCells[`${day}-${hour}`],
    };
    onCellChange(newCells);
  };

  const handleMouseEnter = (day: number, hour: number) => {
    if (isSelecting && startSelection) {
      const minHour = Math.min(startSelection.hour, hour);
      const maxHour = Math.max(startSelection.hour, hour);
      const newSelection: { [key: string]: boolean } = { ...selectedCells };
      for (let h = minHour; h <= maxHour; h++) {
        newSelection[`${day}-${h}`] = true;
      }
      onCellChange(newSelection);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartSelection(null);
  };

  // Agrupar las horas seleccionadas por día en bloques
  const getSelectedHoursByDay = () => {
    const selectedHoursByDay = daysOfWeek.map((_, dayIndex) => {
      // Obtener todas las horas seleccionadas para el día
      const selectedHours = hours.filter((hour) => {
        const key = `${dayIndex}-${hour}`;
        return selectedCells[key]; // Verifica si esta celda está seleccionada
      });

      // Agrupar las horas consecutivas en bloques
      const groupedBlocks: any = [];
      let currentBlock: any = [];

      selectedHours.forEach((hour, index) => {
        if (currentBlock.length === 0) {
          currentBlock.push(hour); // Iniciar un nuevo bloque
        } else if (hour === currentBlock[currentBlock.length - 1] + 1) {
          // Si la hora es consecutiva, agregar al bloque actual
          currentBlock.push(hour);
        } else {
          // Si no es consecutiva, guardar el bloque y empezar uno nuevo
          groupedBlocks.push(currentBlock);
          currentBlock = [hour];
        }

        // Asegurarse de agregar el último bloque después de iterar
        if (index === selectedHours.length - 1) {
          groupedBlocks.push(currentBlock);
        }
      });

      return {
        day: daysOfWeek[dayIndex],
        dayIndex,
        blocks: groupedBlocks.map((block: any) => ({
          start: block[0],
          end: block[block.length - 1],
        })),
      };
    });

    return selectedHoursByDay;
  };

  // Función para determinar si una celda debe tener borde superior o inferior grueso
  const getBorderClasses = (dayIndex: number, hour: number) => {
    const currentKey = `${dayIndex}-${hour}`;
    const aboveKey = `${dayIndex}-${hour - 1}`;
    const belowKey = `${dayIndex}-${hour + 1}`;

    const isCurrentSelected = selectedCells[currentKey];
    const isAboveSelected = selectedCells[aboveKey];
    const isBelowSelected = selectedCells[belowKey];

    let borderClasses = '';

    // Si esta celda está seleccionada
    if (isCurrentSelected) {
      // Si la celda de arriba no está seleccionada, agregamos borde superior grueso
      if (!isAboveSelected) {
        borderClasses += ' !border-t-2 border-t-primary rounded-t-md';
      }

      // Si la celda de abajo no está seleccionada, agregamos borde inferior grueso
      if (!isBelowSelected) {
        borderClasses += ' !border-b-2 border-b-primary rounded-b-md';
      }
    }

    return borderClasses;
  };

  return (
    <div className='p-4 w-full overflow-auto'>
      {/* Contenedor del título y el botón de limpiar */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl text-center '>{title}</h1>
        {/* Botón para limpiar la selección */}
        {clearSelection && (
          <button
            className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary'
            onClick={() => onClearSelection()}
          >
            Limpiar selección
          </button>
        )}
      </div>

      <div
        className='grid grid-cols-[80px_repeat(7,1fr)] w-full border border-gray-100 rounded-md'
        onMouseUp={handleMouseUp}
        style={{ userSelect: 'none' }} // Deshabilitar la selección de texto en el contenedor
      >
        {/* Encabezado de los días (Sticky) */}
        <div className='p-2 text-center font-bold'></div>
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className='p-3 text-center font-bold text-sm sticky top-0 z-10 border-l border-gray-100'
          >
            {day}
          </div>
        ))}

        {/* Horas en la primera columna y celdas de selección */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Columna de las horas */}
            <div className='p-3 text-center font-semibold text-sm text-gray-text-light border-t border-gray-100'>
              {hour}:00
            </div>

            {/* Celdas de selección */}
            {daysOfWeek.map((_, dayIndex) => {
              const key = `${dayIndex}-${hour}`;
              const isSelected = selectedCells[key];
              const borderClasses = getBorderClasses(dayIndex, hour);

              return (
                <div
                  key={key}
                  className={`general-cell ${
                    isSelected ? 'selected-cell' : ''
                  } ${borderClasses}`}
                  onMouseDown={() => handleMouseDown(dayIndex, hour)}
                  onMouseEnter={() => handleMouseEnter(dayIndex, hour)}
                  style={{ userSelect: 'none' }} // Deshabilitar la selección de texto en las celdas
                ></div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Mostrar las horas seleccionadas por día agrupadas en bloques */}
      <div className='mt-6 bg-white rounded-lg p-4'>
        <h2 className='text-xl font-semibold mb-3'>Horas seleccionadas:</h2>
        <ul className='flex flex-wrap gap-3'>
          {getSelectedHoursByDay().map((daySelection) => (
            <li
              key={daySelection.day}
              className={`p-3 rounded-md border ${daySelection.blocks.length > 0 ? 'bg-muted/30' : ''} min-w-[150px]`}
            >
              <strong className='text-primary block mb-1'>
                {daySelection.day}:
              </strong>
              {daySelection.blocks.length === 0 ? (
                <span className='text-muted-foreground text-sm italic'>
                  Sin horas
                </span>
              ) : (
                <div className='space-y-1'>
                  {daySelection.blocks.map((block: any) => (
                    <span
                      key={`${daySelection.day}-${block.start}-${block.end}`}
                      className='block text-sm'
                    >
                      {block.start}:00 - {block.end}:00
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeeklyScheduler;
