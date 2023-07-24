import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {WorkflowModule} from "../model/workflow-module";
import {ModuleStatus} from "../model/module-status";

export const WORKFLOW_MODULES: WorkflowModule[] = [
  new WorkflowModule('onboarding', 'Onboarding', 1, "Onboarding module description", ModuleStatus.inProgress),
  new WorkflowModule('searchEdrs', 'Search EDRS', 0,'The "EDRS Search" workflow simulates ' +
    'searching cases in an Electronic Death Registration System (EDRS). Testers representing Medical Examiners/Coroners (ME/Cs) ' +
    'can provide search parameters executed against the BlueJay EDRS test server, which implements the MDI Documents FHIR ' +
    'Operation for search. Supported parameters include primary case identification fields, as well as additional data ' +
    '(e.g., demographics information) if it exists in the test EDRS case records. Search parameters and all relevant ' +
    'HTTP requests and responses are provided in both human readable forms and as FHIR resources for demonstration.', ModuleStatus.success),
  new WorkflowModule('updateEdrs', 'Update EDRS', 2, "Update EDRS module description", ModuleStatus.notStarted),
]


@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private workflowModules= new BehaviorSubject<WorkflowModule[]>([]);
  workflowModules$ = this.workflowModules.asObservable();
  setWorkflowModules(workflowModules: WorkflowModule[]) {
    this.workflowModules.next(workflowModules);
  }

  constructor() {
    this.setWorkflowModules(WORKFLOW_MODULES);
  }
}
