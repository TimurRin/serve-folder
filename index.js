import express from "express";
import { Command } from "commander";
import serveIndex from "serve-index";
import version from "./version.json" assert { type: "json" };

const VERSION = `${version.major}.${version.minor}.${version.patch}`;

const program = new Command();

program
  .name(version.package)
  .version(VERSION)
  .requiredOption("-f, --folder <PATH>", "folder")
  .option("-p, --port [VALUE]", "port", 63050);

program.parse();

const options = program.opts();

const app = express();

console.log(`Serving folder [${options.folder}]`);
app.use("/", serveIndex(options.folder));
app.use("/", express.static(options.folder));

app.listen(options.port, () => {
  console.log(
    `${version.package}@${VERSION} is ready and listens to port ${options.port}`
  );
});
