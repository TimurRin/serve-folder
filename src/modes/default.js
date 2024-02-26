import express from "express";
import serveIndex from "serve-index";

export default function (app, folder) {
  app.use("/", express.static(folder));
  app.use(
    "/",
    serveIndex(folder, { hidden: true, icons: true, view: "details" }),
  );
}
