import {Component, Input} from '@angular/core';
import {WorkflowModule} from "../../../models/workflow-module";

@Component({
  selector: 'app-available-module-view',
  templateUrl: './available-module-view.component.html',
  styleUrls: ['./available-module-view.component.css']
})
export class AvailableModuleViewComponent {
  @Input() workflowModules: WorkflowModule[];
}
