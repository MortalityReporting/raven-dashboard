import {Component, Inject} from '@angular/core';
import {ModuleHeaderConfig} from "../../../providers/module-header-config";

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.scss']
})

export class WorkflowSimulatorComponent {

  user: string;

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig) {
  }
}
