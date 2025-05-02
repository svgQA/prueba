export const getSelectedHoursByDay = (
  daysOfWeek: string[],
  hours: number[],
  selectedCells: { [key: string]: boolean }
) => {
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

// Example usage:
export const convertBlocksToCells = (blocks: {
  [key: string]: Array<{ start: number; end: number }>;
}): { [key: string]: boolean } => {
  const selectedCells: { [key: string]: boolean } = {};

  // Map of day names to indices
  const dayIndices: { [key: string]: number } = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
  };

  Object.entries(blocks).forEach(([day, timeBlocks]) => {
    const dayIndex = dayIndices[day.toLowerCase()];

    timeBlocks.forEach((block) => {
      // Fill all hours between start and end
      for (let hour = block.start; hour <= block.end; hour++) {
        const key = `${dayIndex}-${hour}`;
        selectedCells[key] = true;
      }
    });
  });

  return selectedCells;
};

// Example of how to use the function:
const blocks = {
  lunes: [
    { start: 9, end: 12 }, // Morning block from 9am to 12pm
    { start: 14, end: 17 }, // Afternoon block from 2pm to 5pm
  ],
  miercoles: [
    { start: 10, end: 15 }, // Single block from 10am to 3pm
  ],
};

const cells = convertBlocksToCells(blocks);
// Result will be an object like:
// {
//   "1-9": true,   // Monday 9am
//   "1-10": true,  // Monday 10am
//   "1-11": true,  // Monday 11am
//   "1-12": true,  // Monday 12pm
//   "1-14": true,  // Monday 2pm
//   "1-15": true,  // Monday 3pm
//   "1-16": true,  // Monday 4pm
//   "1-17": true,  // Monday 5pm
//   "3-10": true,  // Wednesday 10am
//   "3-11": true,  // Wednesday 11am
//   "3-12": true,  // Wednesday 12pm
//   "3-13": true,  // Wednesday 1pm
//   "3-14": true,  // Wednesday 2pm
//   "3-15": true   // Wednesday 3pm
// }
