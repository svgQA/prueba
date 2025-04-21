export interface INotificationScheduledItem {
  id: string;
  templateId: string;
  sendAt: string;
  status: 'pending' | 'sent' | 'failed';
  overrideTitle?: string;
  overrideDescription?: string;
  attachmentUrl?: string;
  filters: any;
  createdAt: string;
  updatedAt: string;
}
