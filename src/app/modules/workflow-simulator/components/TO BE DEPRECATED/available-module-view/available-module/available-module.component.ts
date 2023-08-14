import {Component, Input} from '@angular/core';
import {WorkflowModule} from "../../../../models/workflow-module";
import {ModuleStatus} from "../../../../models/module-status";

@Component({
  selector: 'app-available-module',
  templateUrl: './available-module.component.html',
  styleUrls: ['./available-module.component.css', '../../../workflow-simulator.component.scss']
})


export class AvailableModuleComponent {
  @Input() workflowModule: WorkflowModule;

  onStartWorkflow() {

  }
}
