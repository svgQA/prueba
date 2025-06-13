import type { FilterExpression, Condition, Group } from './utils/types';

const renderCondition = (cond: Condition) => {
  if (cond.operator === 'is defined') return `${cond.field}`;
  if (cond.operator === 'is undefined') return `!${cond.field}`;
  if (cond.operator === 'like') return `${cond.field} ~ '${cond.value}'`;
  if (cond.operator === 'starts with')
    return `${cond.field}.startsWith('${cond.value}')`;
  return `${cond.field} ${cond.operator} '${cond.value}'`;
};

const renderGroup = (group: Group): string => {
  const parts = group.conditions.map((c) =>
    c.type === 'condition' ? renderCondition(c) : `(${renderGroup(c)})`
  );
  return parts.join(` ${group.logic} `);
};

export const EquationPreview = ({ filter }: { filter: FilterExpression }) => {
  const output =
    filter.type === 'condition' ? renderCondition(filter) : renderGroup(filter);
  return (
    <div class='font-mono min-h-10 my-2 px-2 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'>
      {output}
    </div>
  );
};
