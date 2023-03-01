export class ModuleHeaderConfig {

  static RecordViewer = new ModuleHeaderConfig("Record Viewer", "#6EA4BF", "record-viewer");
  static RecordComparison = new ModuleHeaderConfig("Record Comparison", "#673AB7", "record-comparison");
  static ImportRecord = new ModuleHeaderConfig("Import Record", "#4CAF50", "record-import");
  static FhirValidator = new ModuleHeaderConfig("FHIR Validator", "#FFC107", "fhir-validator");
  static WorkflowSimulator = new ModuleHeaderConfig("Workflow Simulator", "#E91E63", "workflow-simulator");

  constructor(title, backgroundColor, icon) {
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.icon = icon;
  }
  title: string;
  backgroundColor: string;
  icon: string;
}
