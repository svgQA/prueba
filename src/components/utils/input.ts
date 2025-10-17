import { TargetedEvent } from 'preact/compat';

export const handleChange = (
  e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const target = e.target as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

  const name = target.name;
  const value =
    target.type === 'checkbox'
      ? (target as HTMLInputElement).checked
      : target.type === 'number' || target instanceof HTMLSelectElement
        ? isNaN(Number(target.value))
          ? target.value
          : Number(target.value)
        : target.value;

  const calue = target.type === 'checkbox' ? target.dataset.value : undefined;
  return {
    name,
    value,
    calue,
    page: target.dataset.page,
    section: target.dataset.section,
  };
};
