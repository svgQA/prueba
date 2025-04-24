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
