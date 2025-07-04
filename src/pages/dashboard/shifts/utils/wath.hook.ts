import { useFormState } from 'react-final-form';
import { useEffect, useRef } from 'preact/hooks';

export const useShiftWatcher = (
  onChangeShift: (id: number, start: string, end: string) => void
  // cleanRelatedShift: () => void
) => {
  const { values } = useFormState();
  const prevValues = useRef({ employeeId: null, start: null, end: null });

  useEffect(() => {
    const { employeeId, start, end } = values;
    const changed =
      // @ts-ignore
      employeeId?.value !== prevValues.current.employeeId?.value ||
      start !== prevValues.current.start ||
      end !== prevValues.current.end;

    if (!changed) {
      // cleanRelatedShift();
      return;
    }

    prevValues.current = { employeeId, start, end };
    if (!employeeId?.value || !start || !end) {
      // cleanRelatedShift();
      return;
    }

    onChangeShift(employeeId.value, start, end);
  }, [values, onChangeShift]);
};
