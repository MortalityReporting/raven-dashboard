import {Component, Inject} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../model/model-header-config";

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.scss']
})
export class WorkflowSimulatorComponent {
  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig) {
  }
}
