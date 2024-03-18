import crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // Strong encryption algorithm
const password = process.env.ENCRYPTION_KEY; // Use a secure key stored in env vars
const iv = crypto.randomBytes(16); // Initialization vector for added security

// Function to encrypt token
export const encryptToken = (token: string) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(password!), iv);
  let encrypted = cipher.update(token);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Function to decrypt token
export const decryptToken = (encryption: string) => {
  const textParts = encryption.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(password!), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};