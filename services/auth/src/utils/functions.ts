import * as crypto from 'crypto';
import { env } from 'shared'


export const encrypt = async (text: string): Promise<string> => {
  const algorithm = 'aes-256-ctr';
  const secretKey = env.ENCRYPTION_KEY;
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}.${encrypted.toString('hex')}`;
};

export const decrypt = async (hash: string): Promise<string> => {
  const algorithm = 'aes-256-ctr';
  const secretKey = env.ENCRYPTION_KEY;

  const [ivHex, encryptedHex] = hash.split('.');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
};