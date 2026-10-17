import { encryptionDecryption } from '../utils/encryptionDecryption';

// Usage: npm run encrypt -- "<value>"  (SECRET_KEY must be set in the shell)
const value = process.argv[2];
if (!value) {
  console.error('❌ No value given. Usage: npm run encrypt -- "<value>"');
  process.exit(1);
}

console.log(new encryptionDecryption().encryptData(value));
