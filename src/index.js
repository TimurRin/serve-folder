import { getNetworkAddressesList } from "@cinnabar-forge/utils";
import { Command } from "commander";
import express from "express";
import fs from "fs";
import path from "path";

import { authMiddleware } from "./auth.js";
import { Mode } from "./types.js";

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
    "default"
  );

program.parse();

const options = program.opts();
console.log(options);

async function loadMode(modeName, folder) {
  let modeModule;
  try {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    modeModule = await import(`./modes/${modeName}.js`);
  } catch (error) {
    throw new Error(`failed to load mode '${modeName}': ${error}`);
  }

  if (!modeModule.default || !(modeModule.default.prototype instanceof Mode)) {
    throw new Error(
      `invalid mode '${modeName}': mode does not extend Mode class.`
    );
  }

  return new modeModule.default(folder);
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
      `the folder ${options.folder} does not exist or is not a directory.`
    );
  }

  const mode = await loadMode(options.mode, resolvedFolder);
  mode.apply(app);

  app.listen(options.port, () => {
    console.log(
      `${version.package}@${VERSION}, '${options.folder}' web locations:\n${getNetworkAddressesList(
        "http",
        options.port
      ).join("\n")}`
    );
  });
})();
