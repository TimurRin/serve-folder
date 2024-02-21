import { Mode } from "../types.js";

export default class GalleryMode extends Mode {
  apply(app) {
    app.get("/", (req, res) => {
      res.send("'gallery' mode is not fully implemented yet.");
    });
  }
}
