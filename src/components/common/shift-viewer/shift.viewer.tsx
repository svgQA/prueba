import { useState } from 'react';
import dayjs from 'dayjs';

// Tipado del turno
export interface Turno {
  persona: string;
  servicio: string;
  turno: string;
  inicio: string;
  fin: string;
}

interface ShiftViewerProps {
  turnos: Turno[];
  className?: string;
  onTurnoUpdate?: (turno: Turno) => void;
}

const colors: Record<string, string> = {
  mañana: 'bg-blue-300',
  tarde: 'bg-yellow-300',
  noche: 'bg-purple-300',
  Reemplazo: 'bg-red-200 text-red-800',
};

const TurnosGanttViewer = ({
  turnos,
  className = '',
  onTurnoUpdate,
}: ShiftViewerProps) => {
  const [editingTurno, setEditingTurno] = useState<Turno | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Turno>>({});

  // Obtener lista única de personas y días
  const personas = Array.from(new Set(turnos.map((t) => t.persona)));
  const dias = Array.from(
    new Set(turnos.map((t) => dayjs(t.inicio).format('YYYY-MM-DD')))
  );

  // Constantes para el diseño
  const CELL_WIDTH = 200;
  const CELL_HEIGHT = 120;
  const HEADER_HEIGHT = 60;
  const LEFT_AXIS_WIDTH = 150;
  const DAY_START_HOUR = 6; // 6 AM
  const HOURS_IN_VIEW = 24; // 24 horas

  const handleEditTurno = (turno: Turno) => {
    setEditingTurno(turno);
    setEditedValues({
      inicio: turno.inicio,
      fin: turno.fin,
    });
  };

  const handleSaveEdit = () => {
    if (editingTurno && onTurnoUpdate) {
      onTurnoUpdate({
        ...editingTurno,
        ...editedValues,
      });
    }
    setEditingTurno(null);
    setEditedValues({});
  };

  const handleCancelEdit = () => {
    setEditingTurno(null);
    setEditedValues({});
  };

  // Función para calcular la posición y altura de un turno
  const calculateTurnoPosition = (inicio: string, fin: string) => {
    const startTime = dayjs(inicio);
    const endTime = dayjs(fin);

    // Convertir a horas desde el inicio del día
    const startHour = startTime.hour() + startTime.minute() / 60;
    const endHour = endTime.hour() + endTime.minute() / 60;

    // Si el turno termina al día siguiente, ajustar la hora final
    const adjustedEndHour = endHour < startHour ? endHour + 24 : endHour;

    // Calcular posición y altura relativas
    const top = ((startHour - DAY_START_HOUR) / HOURS_IN_VIEW) * 100;
    const height = ((adjustedEndHour - startHour) / HOURS_IN_VIEW) * 100;

    return { top, height };
  };

  // Función para organizar los turnos que se solapan
  const organizeTurnos = (turnosDia: Turno[]) => {
    const columns: Turno[][] = [];

    turnosDia.sort(
      (a, b) => dayjs(a.inicio).valueOf() - dayjs(b.inicio).valueOf()
    );

    turnosDia.forEach((turno) => {
      // Encontrar la primera columna donde el turno no se solapa
      const columnIndex = columns.findIndex((column) => {
        const lastTurno = column[column.length - 1];
        return dayjs(turno.inicio).isAfter(dayjs(lastTurno.fin));
      });

      if (columnIndex === -1) {
        // Si no hay columna disponible, crear una nueva
        columns.push([turno]);
      } else {
        // Agregar el turno a la columna existente
        columns[columnIndex].push(turno);
      }
    });

    return columns;
  };

  if (!turnos.length) {
    return (
      <div className={`p-4 ${className}`}>
        <div className='text-center text-gray-500 py-8'>
          No hay turnos para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <h1 className='text-xl font-bold mb-4'>Gantt de Turnos Semanales</h1>
      <div className='overflow-x-auto vox-scroll-design border rounded-md'>
        <div
          className='relative'
          style={{
            width: LEFT_AXIS_WIDTH + dias.length * CELL_WIDTH,
            height: HEADER_HEIGHT + personas.length * CELL_HEIGHT,
          }}
        >
          {/* Eje Y (Empleados) */}
          <div
            className='absolute left-0 top-0 bottom-0'
            style={{ width: LEFT_AXIS_WIDTH }}
          >
            <div className='h-[60px] bg-gray-100 border-r border-gray-300 flex items-center justify-center font-medium'>
              Empleados
            </div>
            {personas.map((persona) => (
              <div
                key={persona}
                className='border-t border-r border-gray-300 flex items-center px-4 font-medium'
                style={{ height: CELL_HEIGHT }}
              >
                {persona}
              </div>
            ))}
          </div>

          {/* Eje X (Fechas) */}
          <div className='absolute left-[150px] right-0 top-0'>
            <div className='flex h-[60px]'>
              {dias.map((dia) => (
                <div
                  key={dia}
                  className='border-b border-r border-gray-300 bg-gray-50 flex items-center justify-center font-medium h-full'
                  style={{ width: CELL_WIDTH }}
                >
                  {dayjs(dia).format('DD/MM/YYYY')}
                </div>
              ))}
            </div>
          </div>

          {/* Grid de fondo con líneas punteadas */}
          <div className='absolute left-[150px] top-[60px] right-0 bottom-0'>
            <div className='relative h-full'>
              {/* Líneas verticales */}
              {dias.map((_, index) => (
                <div
                  key={index}
                  className='absolute top-0 bottom-0 border-r border-dashed border-gray-300'
                  style={{ left: `${index * CELL_WIDTH}px` }}
                />
              ))}
              {/* Líneas horizontales */}
              {personas.map((_, index) => (
                <div
                  key={index}
                  className='absolute left-0 right-0 border-b border-dashed border-gray-300'
                  style={{ top: `${index * CELL_HEIGHT}px` }}
                />
              ))}
            </div>
          </div>

          {/* Contenedor de las tareas */}
          <div className='absolute left-[150px] top-[60px]'>
            {personas.map((persona, personaIndex) => (
              <div key={persona} style={{ height: CELL_HEIGHT }}>
                {dias.map((dia, diaIndex) => {
                  const turnosDia = turnos.filter(
                    (t) =>
                      t.persona === persona &&
                      dayjs(t.inicio).format('YYYY-MM-DD') === dia
                  );

                  const turnosColumns = organizeTurnos(turnosDia);
                  const columnWidth =
                    CELL_WIDTH / Math.max(turnosColumns.length, 1);

                  return (
                    <div
                      key={`${persona}-${dia}`}
                      className='absolute'
                      style={{
                        left: diaIndex * CELL_WIDTH,
                        top: personaIndex * CELL_HEIGHT,
                        width: CELL_WIDTH,
                        height: CELL_HEIGHT,
                      }}
                    >
                      {turnosColumns.map((column, columnIndex) => (
                        <div
                          key={columnIndex}
                          className='absolute top-0 bottom-0'
                          style={{
                            left: `${columnIndex * columnWidth}px`,
                            width: columnWidth,
                          }}
                        >
                          {column.map((turno, i) => {
                            const { top, height } = calculateTurnoPosition(
                              turno.inicio,
                              turno.fin
                            );
                            return (
                              <div
                                key={i}
                                className={`absolute rounded-sm shadow-sm ${colors[turno.turno] || colors[turno.persona] || 'bg-gray-200'} cursor-pointer hover:shadow-md transition-shadow`}
                                style={{
                                  top: `${top}%`,
                                  height: `${height}%`,
                                  left: '2px',
                                  right: '2px',
                                }}
                                onClick={() => handleEditTurno(turno)}
                              >
                                <div className='p-1 text-xs overflow-hidden h-full'>
                                  <div className='font-medium truncate'>
                                    {turno.servicio}
                                  </div>
                                  <div className='opacity-75 truncate'>
                                    {dayjs(turno.inicio).format('HH:mm')} -{' '}
                                    {dayjs(turno.fin).format('HH:mm')}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {editingTurno && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Editar Turno</h2>

            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2 bg-gray-50 p-3 rounded-md'>
                <div className='text-sm font-medium text-gray-500'>
                  Empleado
                </div>
                <div className='text-sm'>{editingTurno.persona}</div>
              </div>

              <div className='bg-gray-50 p-3 rounded-md'>
                <div className='text-sm font-medium text-gray-500'>
                  Servicio
                </div>
                <div className='text-sm'>{editingTurno.servicio}</div>
              </div>

              <div className='bg-gray-50 p-3 rounded-md'>
                <div className='text-sm font-medium text-gray-500'>Turno</div>
                <div className='text-sm'>{editingTurno.turno}</div>
              </div>

              <div className='col-span-2'>
                <div className='text-sm font-medium text-gray-700 mb-1'>
                  Fecha y hora de inicio
                </div>
                <input
                  type='datetime-local'
                  value={dayjs(editedValues.inicio).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setEditedValues({
                      ...editedValues,
                      inicio: target.value + ':00',
                    });
                  }}
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div className='col-span-2'>
                <div className='text-sm font-medium text-gray-700 mb-1'>
                  Fecha y hora de fin
                </div>
                <input
                  type='datetime-local'
                  value={dayjs(editedValues.fin).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setEditedValues({
                      ...editedValues,
                      fin: target.value + ':00',
                    });
                  }}
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button
                onClick={handleCancelEdit}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosGanttViewer;
