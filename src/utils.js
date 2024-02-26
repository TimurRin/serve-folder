import os from 'os';
import path from 'path';

export function generatePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        // eslint-disable-next-line security/detect-object-injection
        password += charset[randomIndex];
    }
    return password;
}

export function getAppDirectory() {
  const homeDir = os.homedir();
  return path.join(homeDir, ".config", "cinnabar-forge", "snapserve");
}
