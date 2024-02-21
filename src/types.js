export class Mode {
    constructor(folder) {
      this.folder = folder;
    }
  
    apply() {
      throw new Error("method 'apply' must be implemented.");
    }
  }