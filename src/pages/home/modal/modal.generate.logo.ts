import { clientImageUrls, allyImageUrls, LogoData } from './modal.image.urls';

export interface LogoItem extends LogoData {
  id: string;
}

function generateLogoItems(logoData: LogoData[]): LogoItem[] {
  return logoData.map((logo, index) => ({
    ...logo,
    id: (index + 1).toString(),
  }));
}

export const clientLogos: LogoItem[] = generateLogoItems(clientImageUrls);
export const allyLogos: LogoItem[] = generateLogoItems(allyImageUrls);
