import ImageKit, { toFile } from '@imagekit/nodejs';
import { env } from '../config/env.config.js';

const storageInstance = new ImageKit({
  publicKey: env.imagekitPublicKey,
  privateKey: env.imagekitPrivateKey,
  urlEndpoint: env.imagekitEndPoint,
});

export const uploadFiles = async ({ buffer, fileName }) => {
  const response = await storageInstance.files.upload({
    file: await toFile(buffer),
    fileName,
    folder: 'product',
  });

  return response;
};
