export interface Memo {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
  priority: 'Alta' | 'Media' | 'Baja';
  noveltyType: string;
  noveltyDate: string;
  moreInfo: string;
  supervisor: string;
  relatedShift: string;
  updatedBy: string;
  location: string;
  client: string;
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
