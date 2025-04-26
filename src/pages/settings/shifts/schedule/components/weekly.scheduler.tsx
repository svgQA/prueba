import React, { useState } from 'react';
import './style.css';
import { DataSchedule } from './data.schedule';
import { getSelectedHoursByDay } from '../utils';

// Props para pasar los datos y las funciones de actualización
interface WeeklySchedulerProps {
  startHour?: number;
  endHour?: number;
  title?: string;
  clearSelection?: boolean;
  selectedCells: { [key: string]: boolean };
  onClearSelection: () => void;
  onCellChange: (newCells: { [key: string]: boolean }) => void;
  daysOfWeek: string[];
  hours: number[];
}

const WeeklyScheduler = ({
  title = '',
  clearSelection = true,
  selectedCells,
  onClearSelection,
  onCellChange,
  daysOfWeek,
  hours,
}: WeeklySchedulerProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startSelection, setStartSelection] = useState<{
    day: number;
    hour: number;
  } | null>(null);

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
          {getSelectedHoursByDay(daysOfWeek, hours, selectedCells).map(
            (daySelection) => (
              <DataSchedule daySelection={daySelection} />
            )
          )}
          {/*<pre>
            {JSON.stringify(
              getSelectedHoursByDay(daysOfWeek, hours, selectedCells),
              null,
              2
            )}
          </pre>*/}
        </ul>
      </div>
    </div>
  );
};

export default WeeklyScheduler;
