import {AppConfiguration} from "./app-configuration";

export class ModuleHeaderConfig {

  static RecordViewer = new ModuleHeaderConfig(AppConfiguration.config.modules["recordViewer"].title, "#6EA4BF", "record-viewer");
  static RecordComparison = new ModuleHeaderConfig(AppConfiguration.config.modules["recordComparison"].title, "#673AB7", "record-comparison");
  static RecordImport = new ModuleHeaderConfig(AppConfiguration.config.modules["recordImport"].title, "#4CAF50", "record-import");
  static FhirValidator = new ModuleHeaderConfig(AppConfiguration.config.modules["fhirValidator"].title, "#dca705", "fhir-validator");
  static WorkflowSimulator = new ModuleHeaderConfig(AppConfiguration.config.modules["workflowSimulator"].title, "#E91E63", "workflow-simulator");

  constructor(title, backgroundColor, icon) {
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.icon = icon;
  }
  title: string;
  backgroundColor: string;
  icon: string;
}
