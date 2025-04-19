export interface INotificationHistoryItem {
  id: string;
  userId: number;
  type: 'manual' | 'scheduled';
  hasViewed: boolean;
  viewedAt: string | null;
  sentAt: string;
  scheduledNotificationId: string | null;
  title: string;
  description: string;
  attachmentUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface INotificationHistoryByScheduled {
  id: string;
  userId: number;
  scheduledNotificationId: string;
  hasViewed: boolean;
  viewedAt: string | null;
  sentAt: string;
  createdAt?: string;
  updatedAt?: string;
  user: {
    id: number;
    name: string;
    email: string;
    status?: 'active' | 'inactive';
  };
}
