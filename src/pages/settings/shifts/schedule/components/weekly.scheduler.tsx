import React, { useState } from 'react';

const WeeklyScheduler = ({ startHour = 0, endHour = 23, title = '' }) => {
  const [selectedCells, setSelectedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [startSelection, setStartSelection] = useState<{
    day: number;
    hour: number;
  } | null>(null);

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const handleMouseDown = (day: number, hour: number) => {
    setIsSelecting(true);
    setStartSelection({ day, hour });
    setSelectedCells((prev) => ({
      ...prev,
      [`${day}-${hour}`]: !prev[`${day}-${hour}`],
    }));
  };

  const handleMouseEnter = (day: number, hour: number) => {
    if (isSelecting && startSelection) {
      const minHour = Math.min(startSelection.hour, hour);
      const maxHour = Math.max(startSelection.hour, hour);

      const newSelection: { [key: string]: boolean } = { ...selectedCells };
      for (let h = minHour; h <= maxHour; h++) {
        newSelection[`${day}-${h}`] = true;
      }
      setSelectedCells(newSelection);
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
        blocks: groupedBlocks.map((block: any) => ({
          start: block[0],
          end: block[block.length - 1],
        })),
      };
    });

    return selectedHoursByDay;
  };

  // Función para limpiar la selección
  const handleClearSelection = () => {
    setSelectedCells({});
  };

  return (
    <div className='p-4 rounded-lg shadow-lg w-full overflow-auto'>
      {/* Contenedor del título y el botón de limpiar */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl text-center '>{title}</h1>
        {/* Botón para limpiar la selección */}
        <button
          className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary'
          onClick={handleClearSelection}
        >
          Limpiar selección
        </button>
      </div>

      <div
        className='grid grid-cols-[80px_repeat(7,1fr)] border border-b-2 w-full'
        onMouseUp={handleMouseUp}
        style={{ userSelect: 'none' }} // Deshabilitar la selección de texto en el contenedor
      >
        {/* Encabezado de los días (Sticky) */}
        <div className='border border-b-2 p-2 text-center font-bold'></div>
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className='border border-b-2 p-3 text-center font-bold text-lg sticky top-0 z-10'
          >
            {day}
          </div>
        ))}

        {/* Horas en la primera columna y celdas de selección */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Columna de las horas */}
            <div className='border border-b-2 p-3 text-center font-semibold '>
              {hour}:00
            </div>

            {/* Celdas de selección */}
            {daysOfWeek.map((_, dayIndex) => {
              const key = `${dayIndex}-${hour}`;
              const isSelected = selectedCells[key];

              return (
                <div
                  key={key}
                  className={`border p-3 cursor-pointer transition-all ${isSelected ? 'bg-primary-opacity border-primary' : 'hover:bg-primary-opacity border-b-2'
                    }`}
                  onMouseDown={() => handleMouseDown(dayIndex, hour)}
                  onMouseEnter={() => handleMouseEnter(dayIndex, hour)}
                  style={{ userSelect: 'none' }} // Deshabilitar la selección de texto en las celdas
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Mostrar las horas seleccionadas por día agrupadas en bloques */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-3">Horas seleccionadas:</h2>
        <ul className="flex flex-wrap gap-3">
          {getSelectedHoursByDay().map((daySelection) => (
            <li
              key={daySelection.day}
              className={`p-3 rounded-md border ${daySelection.blocks.length > 0 ? "bg-muted/30" : ""} min-w-[150px]`}
            >
              <strong className="text-primary block mb-1">{daySelection.day}:</strong>
              {daySelection.blocks.length === 0 ? (
                <span className="text-muted-foreground text-sm italic">Sin horas</span>
              ) : (
                <div className="space-y-1">
                  {daySelection.blocks.map((block: any) => (
                    <span key={`${daySelection.day}-${block.start}-${block.end}`} className="block text-sm">
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
