import { useState } from 'react';
import dayjs from 'dayjs';

// Tipado del shift
export interface Shift {
  person: string;
  service: string;
  serviceId: number;
  employeeId: number;
  shift?: string;
  start: string;
  end: string;
}

interface ShiftViewerProps {
  shifts: Shift[];
  className?: string;
  onShiftUpdate?: (shift: Shift) => void;
}

const colors: Record<string, string> = {
  mañana: 'bg-blue-300',
  tarde: 'bg-yellow-300',
  noche: 'bg-purple-300',
  Reemplazo: 'bg-red-200 text-red-800',
};

export const ShiftsGanttViewer = ({
  shifts,
  className = '',
  onShiftUpdate,
}: ShiftViewerProps) => {
  const [editingshift, setEditingshift] = useState<Shift | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Shift>>({});

  // Obtener lista única de people y días
  const people = Array.from(new Set(shifts.map((t) => t.employeeId))).map(
    (id) => {
      const shift = shifts.find((s) => s.employeeId === id);
      return {
        id: id,
        name: shift?.person || '',
      };
    }
  );
  const dias = Array.from(
    new Set(shifts.map((t) => dayjs(t.start).format('YYYY-MM-DD')))
  );

  // Constantes para el diseño
  const CELL_WIDTH = 200;
  const CELL_HEIGHT = 120;
  const HEADER_HEIGHT = 60;
  const LEFT_AXIS_WIDTH = 150;
  const DAY_START_HOUR = 6; // 6 AM
  const HOURS_IN_VIEW = 24; // 24 horas

  const handleEditshift = (shift: Shift) => {
    setEditingshift(shift);
    setEditedValues({
      start: shift.start,
      end: shift.end,
    });
  };

  const handleSaveEdit = () => {
    if (editingshift && onShiftUpdate) {
      onShiftUpdate({
        ...editingshift,
        ...editedValues,
      });
    }
    setEditingshift(null);
    setEditedValues({});
  };

  const handleCancelEdit = () => {
    setEditingshift(null);
    setEditedValues({});
  };

  // Función para calcular la posición y altura de un shift
  const calculateshiftPosition = (start: string, end: string) => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);

    // Convertir a horas desde el start del día
    const startHour = startTime.hour() + startTime.minute() / 60;
    const endHour = endTime.hour() + endTime.minute() / 60;

    // Si el shift termina al día siguiente, ajustar la hora endal
    const adjustedEndHour = endHour < startHour ? endHour + 24 : endHour;

    // Calcular posición y altura relativas
    const top = ((startHour - DAY_START_HOUR) / HOURS_IN_VIEW) * 100;
    const height = ((adjustedEndHour - startHour) / HOURS_IN_VIEW) * 100;

    return { top, height };
  };

  // Función para organizar los shifts que se solapan
  const organizeshifts = (shiftsDia: Shift[]) => {
    const columns: Shift[][] = [];

    shiftsDia.sort(
      (a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf()
    );

    shiftsDia.forEach((shift) => {
      // Encontrar la primera columna donde el shift no se solapa
      const columnIndex = columns.findIndex((column) => {
        const lastshift = column[column.length - 1];
        return dayjs(shift.start).isAfter(dayjs(lastshift.end));
      });

      if (columnIndex === -1) {
        // Si no hay columna disponible, crear una nueva
        columns.push([shift]);
      } else {
        // Agregar el shift a la columna existente
        columns[columnIndex].push(shift);
      }
    });

    return columns;
  };

  if (!shifts.length) {
    return (
      <div className={`p-4 ${className}`}>
        <div className='text-center text-gray-500 py-8'>
          No hay shifts para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <h1 className='text-xl font-bold mb-4'>Gantt de shifts Semanales</h1>
      <div className='overflow-x-auto vox-scroll-design border rounded-md'>
        <div
          className='relative'
          style={{
            width: LEFT_AXIS_WIDTH + dias.length * CELL_WIDTH,
            height: HEADER_HEIGHT + people.length * CELL_HEIGHT,
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
            {people.map((person) => (
              <div
                key={person.id}
                className='border-t border-r border-gray-300 flex items-center px-4 font-medium'
                style={{ height: CELL_HEIGHT }}
              >
                {person.name}
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
              {people.map((_, index) => (
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
            {people.map((person, personIndex) => (
              <div key={person.id} style={{ height: CELL_HEIGHT }}>
                {dias.map((dia, diaIndex) => {
                  const shiftsDia = shifts.filter(
                    (t) =>
                      t.employeeId === person.id &&
                      dayjs(t.start).format('YYYY-MM-DD') === dia
                  );

                  const shiftsColumns = organizeshifts(shiftsDia);
                  const columnWidth =
                    CELL_WIDTH / Math.max(shiftsColumns.length, 1);

                  return (
                    <div
                      key={`${person.id}-${dia}`}
                      className='absolute'
                      style={{
                        left: diaIndex * CELL_WIDTH,
                        top: personIndex * CELL_HEIGHT,
                        width: CELL_WIDTH,
                        height: CELL_HEIGHT,
                      }}
                    >
                      {shiftsColumns.map((column, columnIndex) => (
                        <div
                          key={columnIndex}
                          className='absolute top-0 bottom-0'
                          style={{
                            left: `${columnIndex * columnWidth}px`,
                            width: columnWidth,
                          }}
                        >
                          {column.map((shift, i) => {
                            const { top, height } = calculateshiftPosition(
                              shift.start,
                              shift.end
                            );
                            return (
                              <div
                                key={i}
                                className={`absolute rounded-sm shadow-sm ${colors[shift.service] || 'bg-gray-200'} cursor-pointer hover:shadow-md transition-shadow`}
                                style={{
                                  top: `${top}%`,
                                  height: `${height}%`,
                                  left: '2px',
                                  right: '2px',
                                }}
                                onClick={() => handleEditshift(shift)}
                              >
                                <div className='p-1 text-xs overflow-hidden h-full'>
                                  <div className='font-medium truncate'>
                                    {shift.service}
                                  </div>
                                  <div className='opacity-75 truncate'>
                                    {dayjs(shift.start).format('HH:mm')} -{' '}
                                    {dayjs(shift.end).format('HH:mm')}
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
      {editingshift && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Editar shift</h2>

            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2 bg-gray-50 p-3 rounded-md'>
                <div className='text-sm font-medium text-gray-500'>
                  Empleado
                </div>
                <div className='text-sm'>{editingshift.person}</div>
              </div>

              <div className='bg-gray-50 p-3 rounded-md'>
                <div className='text-sm font-medium text-gray-500'>service</div>
                <div className='text-sm'>{editingshift.service}</div>
              </div>

              <div className='bg-gray-50 p-3 rounded-md'>
                <div className='text-sm font-medium text-gray-500'>shift</div>
                <div className='text-sm'>{editingshift.shift}</div>
              </div>

              <div className='col-span-2'>
                <div className='text-sm font-medium text-gray-700 mb-1'>
                  Fecha y hora de start
                </div>
                <input
                  type='datetime-local'
                  value={dayjs(editedValues.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setEditedValues({
                      ...editedValues,
                      start: target.value + ':00',
                    });
                  }}
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div className='col-span-2'>
                <div className='text-sm font-medium text-gray-700 mb-1'>
                  Fecha y hora de end
                </div>
                <input
                  type='datetime-local'
                  value={dayjs(editedValues.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setEditedValues({
                      ...editedValues,
                      end: target.value + ':00',
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
