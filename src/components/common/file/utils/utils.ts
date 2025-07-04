import { GeneralService } from '@/services/general/general';
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

  await handleFileSaveWrapper(
    file,
    file.name,
    file.type,
    onChange,
    area || "form",
    e,
  );
};

export const handleFileSaveWrapper = async (
  file: any,
  name: string,
  type: any,
  onChange: (dataset: any, images: IPresignedRequest) => any,
  area?: AllowedAreaTypes,
  e?: React.ChangeEvent<HTMLInputElement>,
) => {
  const model: IPresignedRequest = {
    name: name,
    type: type as
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
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  onChange(e && e.target instanceof HTMLInputElement ? e.target.dataset : undefined, model);
};

export const uploadFiles = async (
  file: any,
  url: string,
) => {
  await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
}
