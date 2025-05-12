export interface IShiftSetting {
  name: string;
  description: string;
  status: boolean;
  max_check_range: number;
  max_check_time: number;
  min_check_time: number;
  field_shift_table: string[];
  has_service: boolean;
  has_contract: boolean;
  has_shift: boolean;
  has_round: boolean;
  has_task: boolean;
  has_report: boolean;
}

export interface FormValues
  extends Omit<
    IShiftSetting,
    'max_check_range' | 'max_check_time' | 'min_check_time'
  > {
  max_check_range: string;
  max_check_time: string;
  min_check_time: string;
}

export interface IShiftSettingResponse {
  id: number;
  type: string;
  title: string;
  description: string;
  settings: IShiftSetting;
}
