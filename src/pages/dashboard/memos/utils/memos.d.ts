export interface Memo {
  id: number;
  description: string;
  firstName: string;
  lastName: string;
  workerAge: number;
  workerPhoto: string;
  workerEmail: string;
  contact: number;
  visits: number;
  status: string;
  progress: number;
  priority: 'Alta' | 'Media' | 'Baja';
  noveltyType: string;
  noveltyDate: string;
  moreInfo: string;
  supervisor: string;
  supervisorPhoto: string;
  supervisorPhone: number;
  supervisorEmail: string;
  supervisorAge: number;
  shift: string;
  updatedBy: string;
  location: string;
  clientName: string;
  clientPhone: number;
  clientEmail: string;
  clientPhoto: string;
  clientLocation: string;
  city: string;
  company: string;
  address: string;
  mapUrl: string;
  attachments: {
    type: 'image' | 'pdf' | 'audio' | 'excel';
    url: string;
    name: string;
  }[];
}
