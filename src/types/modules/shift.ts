export interface IShiftSetting {
  name: string;
  time_checkin_min: number;
  time_checkin_max: number;
  time_checkout_min: number;
  time_checkout_max: number;
  distance_checkin_max: number;
  distance_checkout_max: number;
  allow_shift: boolean;
  allow_service: boolean;
  allow_contract: boolean;
  allow_round: boolean;
  allow_task: boolean;
  create_shift: boolean;
}

export interface IShiftSettingResponse {
  id: number;
  type: string;
  title: string;
  description: string;
  settings: IShiftSetting;
}
