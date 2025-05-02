import { IShiftResponse } from '@/types/shift/activity';
import ContractInfo from './expandable/contract.expandable';
import DateInfo from './expandable/date.expandable';
import EmployeeInfo from './expandable/employee.expandable';
import RoundInfo from './expandable/round.expandable';
import ServiceInfo from './expandable/service.expandable ';
import ShiftInfo from './expandable/shift.expandable';

enum InfoType {
  EMPLOYED = 'employee',
  SERVICE = 'service',
  CONTRACT = 'contract',
  DATE = 'time',
  REPORT = 'report',
  SHIFT = 'shift',
  ROUND = 'round',
}

type Props = {
  type: string;
  data: IShiftResponse;
};

const getInfoContent = (type: string, shift: IShiftResponse) => {
  const { service, employee } = shift;
  if (type.startsWith('time')) {
    return (
      <DateInfo
        checkIn={shift.checkIn}
        checkOut={shift.checkOut}
        employee={employee}
        shift={shift}
      />
    );
  }

  switch (type) {
    case InfoType.SERVICE:
      return <ServiceInfo service={service} />;
    case InfoType.EMPLOYED:
      return <EmployeeInfo employee={employee} place={service.place} />;
    case InfoType.CONTRACT:
      return <ContractInfo contract={service.contract} />;
    // case InfoType.REPORT:
    //   return <ReportInfo data={data} />;
    case InfoType.SHIFT:
      return <ShiftInfo data={shift} />;
    case InfoType.ROUND:
      return <RoundInfo />;
  }
};

export const ExpandableMultiple = ({ type, data }: Props) => {
  return <div class='info-container'>{getInfoContent(type, data)}</div>;
};
