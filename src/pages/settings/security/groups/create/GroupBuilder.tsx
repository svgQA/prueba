import { Dropdown } from '@/components/common/dropdown/dropdown';
import { ConditionBuilder } from './ConditionBuilder';
import { FilterExpression, Group } from './utils/types';
import { createEmptyCondition, createEmptyGroup } from './utils/utils';
import { Button } from '@/components/common/button/button';

interface Props {
  group: Group;
  onChange: (updated: Group) => void;
  onRemove: () => void;
}

const logic_options = [
  {
    label: 'AND',
    value: 'AND',
  },
  { label: 'OR', value: 'OR' },
];

export const GroupBuilder = ({ group, onChange, onRemove }: Props) => {
  const updateCondition = (index: number, updated: FilterExpression) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updated;
    onChange({ ...group, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: newConditions });
  };

  const addCondition = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, createEmptyCondition()],
    });
  };

  const addGroup = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, createEmptyGroup()],
    });
  };

  return (
    <div class='border dark:border-b-dark-light bg-white dark:bg-b-dark-dark p-3 rounded space-y-2'>
      <div class='flex justify-between items-center'>
        <div class='w-32'>
          <Dropdown
            name='drp-logic-conditio'
            options={logic_options}
            value={group.logic}
            onChange={(val) => {
              onChange({
                ...group,
                logic: val as 'AND' | 'OR',
              });
            }}
          />
        </div>
        <Button
          name='btn-delete-group'
          rounded={false}
          icon='041'
          borderless
          onClick={onRemove}
        />
      </div>
      {group.conditions.map((cond, i) =>
        cond.type === 'condition' ? (
          <ConditionBuilder
            key={cond.id}
            condition={cond}
            onChange={(updated) => updateCondition(i, updated)}
            onRemove={() => removeCondition(i)}
          />
        ) : (
          <GroupBuilder
            key={cond.id}
            group={cond}
            onChange={(updated) => updateCondition(i, updated)}
            onRemove={() => removeCondition(i)}
          />
        )
      )}
      <div class='flex gap-2 justify-end'>
        <Button
          name='btn-add-condition'
          rounded={false}
          label='condition'
          icon='039'
          onClick={addCondition}
        />
        <Button
          name='btn-add-group'
          rounded={false}
          label='group'
          icon='039'
          onClick={addGroup}
        />
      </div>
    </div>
  );
};
