import { IShiftResponse } from '@/types/shift/activity';
import ContractInfo from './expandable/contract.expandable';
import DateInfo from './expandable/date.expandable';
import EmployeeInfo from './expandable/employee.expandable';
import ReportInfo from './expandable/report.expandable';
import RoundInfo from './expandable/round.expandable';
import ServiceInfo from './expandable/service.expandable ';
import ShiftInfo from './expandable/shift.expandable';

enum InfoType {
  EMPLOYED = 'employee',
  SERVICE = 'service',
  CONTRACT = 'contract',
  DATE = 'start-end',
  REPORT = 'report',
  SHIFT = 'shift',
  ROUND = 'round',
}

type Props = {
  type: string;
  data: IShiftResponse;
};

const getInfoContent = (type: string, data: IShiftResponse) => {
  const { service, employee } = data;
  console.log('service.contract ==>', service.contract);

  switch (type) {
    case InfoType.SERVICE:
      return <ServiceInfo service={service} />;
    case InfoType.EMPLOYED:
      return <EmployeeInfo employee={employee} place={service.place} />;
    case InfoType.CONTRACT:
      return <ContractInfo contract={service.contract} />;
    case InfoType.DATE:
      return <DateInfo data={data} />;
    case InfoType.REPORT:
      return <ReportInfo data={data} />;
    case InfoType.SHIFT:
      return <ShiftInfo data={data} />;
    case InfoType.ROUND:
      return <RoundInfo />;
  }
};

export const ExpandableMultiple = ({ type, data }: Props) => {
  return <div class='info-container'>{getInfoContent(type, data)}</div>;
};
