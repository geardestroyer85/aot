import * as crypto from 'crypto';
import * as dotenv from 'dotenv';


dotenv.config();

export const encrypt = async (text: string): Promise<string> => {
  const algorithm = 'aes-256-ctr';
  const secretKey =
    process.env.ENCRYPTION_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}.${encrypted.toString('hex')}`;
};

export const decrypt = async (hash: string): Promise<string> => {
  const algorithm = 'aes-256-ctr';
  const secretKey =
    process.env.ENCRYPTION_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

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