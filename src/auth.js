import basicAuth from "express-basic-auth";
import fs from "fs";
import path from "path";

function loadUsersFromConfig() {
  const configPath = path.join(".", "data", "users.json");
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
