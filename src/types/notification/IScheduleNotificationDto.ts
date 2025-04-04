export interface IScheduleNotificationDto {
  templateId: string;
  sendAt: string; // formato ISO (ej. new Date().toISOString())
  filters: {
    userIds: string[];
    shiftToday: boolean;
  };
  overrideTitle?: string;
  overrideDescription?: string;
}
