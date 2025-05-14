import { Shift } from '../shift-viewer/shift.viewer';

export function fixTruncatedJSONArray(input: string): Shift[] {
  const cleanedInput = input.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  try {
    return JSON.parse(cleanedInput);
  } catch {
    const lastCompleteObjectEnd = cleanedInput.lastIndexOf('}');
    if (lastCompleteObjectEnd === -1) return [];

    const openBracketIndex = cleanedInput.indexOf('[');
    if (openBracketIndex === -1) return [];

    const jsonArrayBody = cleanedInput.slice(
      openBracketIndex,
      lastCompleteObjectEnd + 1
    );
    const finalJSON = jsonArrayBody.endsWith(']')
      ? jsonArrayBody
      : jsonArrayBody + ']';
    try {
      return JSON.parse(finalJSON);
    } catch {
      return [];
    }
  }
}
