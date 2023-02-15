export class ModuleHeaderConfig {

  static RecordViewer = new ModuleHeaderConfig("Record Viewer", "#9fa8da");
  static RecordComparison = new ModuleHeaderConfig("Record Comparison", "#ff0000");

  constructor(title, backgroundColor) {
    this.title = title;
    this.backgroundColor = backgroundColor
  }
  title: string;
  backgroundColor: string;
}
