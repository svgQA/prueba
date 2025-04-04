import { Shift } from '../shift-viewer/shift.viewer';

export function fixTruncatedJSONArray(input: string): Shift[] {
  // Limpiamos las secuencias de escape una sola vez
  // console.log('input', input);
  const cleanedInput = input.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  // console.log('cleanedInput', cleanedInput);
  try {
    // Intentamos parsear directamente el input limpio
    return JSON.parse(cleanedInput);
  } catch {
    // Si falla, buscamos el último objeto completo
    const lastCompleteObjectEnd = cleanedInput.lastIndexOf('}');
    // console.log('lastCompleteObjectEnd', lastCompleteObjectEnd);
    if (lastCompleteObjectEnd === -1) return [];

    // Extraemos el array desde el primer corchete hasta el último objeto completo
    const openBracketIndex = cleanedInput.indexOf('[');
    // console.log('openBracketIndex', openBracketIndex);
    if (openBracketIndex === -1) return [];

    const jsonArrayBody = cleanedInput.slice(
      openBracketIndex,
      lastCompleteObjectEnd + 1
    );
    // console.log('jsonArrayBody', jsonArrayBody);
    const finalJSON = jsonArrayBody.endsWith(']')
      ? jsonArrayBody
      : jsonArrayBody + ']';
    // console.log('finalJSON', finalJSON);
    try {
      // console.log('JSON.parse(finalJSON)', JSON.parse(finalJSON));
      return JSON.parse(finalJSON);
    } catch {
      return [];
    }
  }
}
