import { gzip } from 'pako';

export const jsonToGzipBase64 = (obj: any): string => {
  const jsonString = JSON.stringify(obj);
  const compressed = gzip(jsonString);
  return btoa(String.fromCharCode.apply(null, Array.from(compressed)));
};
