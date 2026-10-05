import cryptoJS from 'crypto-js';

export class encryptionDecryption {
  private secretKey: string;

  constructor() {
    const key = process.env.SECRET_KEY;
    if (!key) {
      throw new Error('SECRET_KEY is not set. Pass it during execution, e.g. SECRET_KEY=xxx npx playwright test');
    }
    this.secretKey = key;
  }

  /**
   * Encrypts the string data with use of secret Key
   * @param data string
   * @returns encryptedData
   */
  public encryptData(data: string) {
    return cryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  /**
   * Decrypts encrypted data
   * @param encData
   * @returns decryptedData
   */
  public decryptData(encData: string) {
    const decryptedData = cryptoJS.AES.decrypt(encData, this.secretKey).toString(cryptoJS.enc.Utf8);
    if (!decryptedData) {
      throw new Error('Decryption failed. Check that SECRET_KEY matches the key used to encrypt the value.');
    }
    return decryptedData;
  }
}
