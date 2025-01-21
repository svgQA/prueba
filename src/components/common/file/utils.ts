import { GeneralService } from '@/services/general';
import {
  AllowedAreaTypes,
  AllowedAudioTypes,
  AllowedDocumentTypes,
  AllowedImageTypes,
  AllowedVideoTypes,
} from '@/types';
import { IPresignedRequest } from '@/types/file';
import shortUUID from 'short-uuid';

export const handleFileChangeWrapper = async (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (dataset: any, images: IPresignedRequest) => any,
  area?: AllowedAreaTypes
) => {
  if (!e.target || !(e.target instanceof HTMLInputElement)) return;
  const files = e.target.files;
  if (!files || !files[0]) return;
  const file = files[0];

  const model: IPresignedRequest = {
    name: file.name,
    type: file.type as
      | AllowedAudioTypes
      | AllowedImageTypes
      | AllowedVideoTypes
      | AllowedDocumentTypes,
    uuid: shortUUID().generate(),
    area,
  };

  const response = await GeneralService.presigned(model);
  if (!response.getStatus()) return;

  const urlModel = response.getOne();

  await fetch(urlModel.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  onChange(e.target.dataset, model);
};
