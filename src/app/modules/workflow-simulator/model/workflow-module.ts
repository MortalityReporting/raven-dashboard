import {ModuleStatus} from "./module-status";

export class WorkflowModule {
  name: string;
  displayName: string;
  description: string;
  status: ModuleStatus;
  sortOrder: number;
  constructor(name: string, displayName, sortOder: number, description: string, status?: ModuleStatus ){
    this.name = name;
    this.displayName = displayName;
    this.description = description;
    this.status = status ?? ModuleStatus.notStarted;
    this.sortOrder = sortOder
  }
}
