import basicAuth from "express-basic-auth";
import fs from "fs";
import path from "path";

import { generatePassword, getAppDirectory } from "./utils.js";

function loadUsersFromConfig() {
  const appDir = getAppDirectory();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(appDir)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.mkdirSync(appDir, { recursive: true });
  }
  const configPath = path.join(appDir, "users.json");
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!fs.existsSync(configPath)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(
      configPath,
      JSON.stringify({ admin: generatePassword(12) }),
      "utf8"
    );
    console.log("Check data/users.json for a username-password pair")
  }
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const configFile = fs.readFileSync(configPath);
  return JSON.parse(configFile);
}

export function authMiddleware() {
  const users = loadUsersFromConfig();
  return basicAuth({
    challenge: true,
    unauthorizedResponse: () => `Access denied. Invalid credentials`,
    users,
  });
}
