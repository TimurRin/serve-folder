import express from "express";
import serveIndex from "serve-index";

import { Mode } from "../types.js";

export default class DefaultMode extends Mode {
  apply(app) {
    app.use("/", express.static(this.folder));
    app.use("/", serveIndex(this.folder, { icons: true }));
  }
}
