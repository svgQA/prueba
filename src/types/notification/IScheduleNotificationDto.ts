export interface IScheduleNotificationDto {
  templateId: string;
  sendAt: string; // formato ISO (ej. new Date().toISOString())
  sentTo: number[];
  filters: {
    userIds: string[];
    shiftToday: boolean;
  };
  attachmentUrl: any;
  overrideTitle?: string;
  overrideDescription?: string;
  repeatEveryMinutes: any;
  maxRepeats: any;
  repeatUntil: any;
}
