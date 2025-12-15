/**
 *  Hook para tener un ref siempre sincronizado con un estado,
 * sin efectos que re-setean state.
 */
import { useEffect, useRef } from 'preact/hooks';

export function useSyncedRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
