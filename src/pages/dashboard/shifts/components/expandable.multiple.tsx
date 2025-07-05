import { IShiftResponse } from '@/types/shift/activity';
import ContractInfo from './expandable/contract.expandable';
import DateInfo from './expandable/date.expandable';
import EmployeeInfo from './expandable/employee.expandable';
import RoundInfo from './expandable/round.expandable';
import ServiceInfo from './expandable/service.expandable ';
import ShiftInfo from './expandable/shift.expandable';
import ReportInfo from './expandable/report.expandable';
import TaskInfo from './expandable/task.expandable';
// import ReportInfo from './expandable/report.expandable';

type Props = {
  type?: string;
  data: IShiftResponse;
  onCheck?: (parametro: any) => void;
};

const getInfoContent = (
  type: string,
  shift: IShiftResponse,
  onCheck?: (parametro: any) => void
) => {
  const { service, employee, activityPct, roundPct, tasks, report, task } =
    shift;

  console.log('tasks', task);

  switch (type) {
    case 'service':
      return <ServiceInfo service={service} shift={shift} />;
    case 'employee':
      return (
        <EmployeeInfo
          employee={employee}
          place={service.place}
          activityPct={activityPct}
          roundPct={roundPct}
          service={service}
        />
      );
    case 'contract':
      return <ContractInfo contract={service.contract} />;
    case 'shift':
      return (
        <ShiftInfo
          tasks={tasks}
          activityPct={activityPct}
          start={shift.start}
          end={shift.end}
        />
      );
    case 'report':
      return (
        <ReportInfo reports={report} onViewDetails={(r) => console.log(r)} />
      );
    case 'task':
      return <TaskInfo shiftId={Number(shift.id)} tasks={task} />;
    case 'round':
      return (
        <RoundInfo
          shift={shift.id}
          round={service?.round?.id}
          frequency={service?.round?.frequency}
        />
      );
    case 'time-start':
      return (
        <DateInfo
          checkIn={shift.checkIn}
          checkOut={shift.checkOut}
          employee={employee}
          shift={shift}
          onCheck={onCheck}
        />
      );
    case 'time-end':
      return (
        <DateInfo
          checkIn={shift.checkIn}
          checkOut={shift.checkOut}
          employee={employee}
          shift={shift}
          onCheck={onCheck}
        />
      );
    default:
      return <>No content</>;
  }
};

export const ExpandableMultiple = ({ type, data, onCheck }: Props) => {
  return (
    <div className='info-container'>
      {type && data && getInfoContent(type, data, onCheck)}
    </div>
  );
};
