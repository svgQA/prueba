import { clientImageUrls, allyImageUrls } from './modal.image.urls';

export interface LogoItem {
  id: string;
  name: string;
  imageUrl: string;
}

function generateLogoItems(imageUrls: string[], prefix: string): LogoItem[] {
  return imageUrls.map((url, index) => ({
    id: (index + 1).toString(),
    name: `${prefix} ${index + 1}`,
    imageUrl: url,
  }));
}

export const clientLogos: LogoItem[] = generateLogoItems(
  clientImageUrls,
  'Cliente'
);
export const allyLogos: LogoItem[] = generateLogoItems(allyImageUrls, 'Aliado');
