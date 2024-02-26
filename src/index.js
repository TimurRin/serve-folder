import { getNetworkAddressesList } from "@cinnabar-forge/utils";
import { Command } from "commander";
import express from "express";
import fs from "fs";
import path from "path";

import { authMiddleware } from "./auth.js";

const version = JSON.parse(fs.readFileSync("version.json", "utf8"));

const VERSION = `${version.major}.${version.minor}.${version.patch}`;

const program = new Command();

program
  .name(version.package)
  .version(VERSION)
  .requiredOption("-f, --folder <PATH>", "Specify the folder to serve")
  .option("-p, --port [VALUE]", "Specify the port", 63050)
  .option("-n, --noAuth", "Disable auth")
  .option(
    "-m, --mode <MODE>",
    "Specify the mode (default, gallery)",
    "default",
  );

program.parse();

const options = program.opts();
console.log(options);

async function loadMode(app, modeName, folder) {
  let modeModule;

  try {
    if (modeName.startsWith("npm-")) {
      const packageName = modeName.substring(4);
      const fullPackageName = `snapserve-${packageName}`;
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      modeModule = await import(
        path.join(process.env.NODE_PATH, fullPackageName, "index.js")
      );
    } else {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      modeModule = await import(`./modes/${modeName}.js`);
    }
  } catch (error) {
    throw new Error(`Failed to load mode '${modeName}': ${error}`);
  }

  if (!modeModule.default) {
    throw new Error(
      `Invalid mode '${modeName}': Doesn't have a default export`,
    );
  }

  return modeModule.default(app, folder);
}

const app = express();

if (!options.noAuth) {
  app.use(authMiddleware());
}

(async () => {
  const resolvedFolder = path.resolve(options.folder);
  if (
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    !fs.existsSync(resolvedFolder) ||
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    !fs.lstatSync(resolvedFolder).isDirectory()
  ) {
    throw new Error(
      `the folder ${options.folder} does not exist or is not a directory.`,
    );
  }

  await loadMode(app, options.mode, resolvedFolder);

  app.listen(options.port, () => {
    console.log(
      `${version.package}@${VERSION}, '${options.folder}' web locations:\n${getNetworkAddressesList(
        "http",
        options.port,
      ).join("\n")}`,
    );
  });
})();
