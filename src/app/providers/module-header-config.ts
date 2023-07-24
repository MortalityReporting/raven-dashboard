import {AppConfiguration} from "./app-configuration";

export class ModuleHeaderConfig {
  static RecordViewer = new ModuleHeaderConfig(AppConfiguration.config.modules["recordViewer"].title, AppConfiguration.config.modules["recordViewer"].color, AppConfiguration.config.modules["recordViewer"].icon);
  static RecordComparison = new ModuleHeaderConfig(AppConfiguration.config.modules["recordComparison"].title, AppConfiguration.config.modules["recordComparison"].color, AppConfiguration.config.modules["recordComparison"].icon);
  static RecordImport = new ModuleHeaderConfig(AppConfiguration.config.modules["recordImport"].title, AppConfiguration.config.modules["recordImport"].color, AppConfiguration.config.modules["recordImport"].icon);
  static FhirValidator = new ModuleHeaderConfig(AppConfiguration.config.modules["fhirValidator"].title, AppConfiguration.config.modules["fhirValidator"].color, AppConfiguration.config.modules["fhirValidator"].icon);
  static WorkflowSimulator = new ModuleHeaderConfig(AppConfiguration.config.modules["workflowSimulator"].title, AppConfiguration.config.modules["workflowSimulator"].color, AppConfiguration.config.modules["workflowSimulator"].icon);
  static AdminPanel = new ModuleHeaderConfig(AppConfiguration.config.modules["adminPanel"].title, AppConfiguration.config.modules["adminPanel"].color, AppConfiguration.config.modules["adminPanel"].icon)

  constructor(title, backgroundColor, icon) {
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.icon = icon;
  }
  title: string;
  backgroundColor: string;
  icon: string;
}
