export class ModuleHeaderConfig {

  static RecordViewer = new ModuleHeaderConfig("Record Viewer", "#6EA4BF", "record-viewer");
  static RecordComparison = new ModuleHeaderConfig("Record Comparison", "#B93CA6", "record-comparison");
  static ImportRecord = new ModuleHeaderConfig("Import Record", "#9fa8da", "record-import");
  static FhirValidator = new ModuleHeaderConfig("FHIR Validator", "#49721D", "fhir-validator");
  static WorkflowSimulator = new ModuleHeaderConfig("Workflow Simulator", "#FFE45C", "workflow-simulator");

  constructor(title, backgroundColor, icon) {
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.icon = icon;
  }
  title: string;
  backgroundColor: string;
  icon: string;
}
