import { IShiftResponse } from '@/types/shift/activity';
import ContractInfo from './expandable/contract.expandable';
import DateInfo from './expandable/date.expandable';
import EmployeeInfo from './expandable/employee.expandable';
import RoundInfo from './expandable/round.expandable';
import ServiceInfo from './expandable/service.expandable ';
import ShiftInfo from './expandable/shift.expandable';
// import ReportInfo from './expandable/report.expandable';

type Props = {
  type?: string;
  data: IShiftResponse;
};

const getInfoContent = (type: string, shift: IShiftResponse) => {
  const { service, employee, activityPct, roundPct } = shift;
  switch (type) {
    case 'service':
      return <ServiceInfo service={service} />;
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
    // case 'report':
    //   return <ReportInfo data={data} />;
    case 'shift':
      return <ShiftInfo data={shift} />;
    case 'round':
      return <RoundInfo roundPct={roundPct} />;
    case 'time-start':
      return (
        <DateInfo
          checkIn={shift.checkIn}
          checkOut={shift.checkOut}
          employee={employee}
          shift={shift}
        />
      );
    case 'time-end':
      return (
        <DateInfo
          checkIn={shift.checkIn}
          checkOut={shift.checkOut}
          employee={employee}
          shift={shift}
        />
      );
    default:
      return <>No content</>;
  }
};

export const ExpandableMultiple = ({ type, data }: Props) => {
  return (
    <div className='info-container'>
      {type && data && getInfoContent(type, data)}
    </div>
  );
};
