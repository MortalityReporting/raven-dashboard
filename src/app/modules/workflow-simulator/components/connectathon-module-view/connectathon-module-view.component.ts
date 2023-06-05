import {Component, Input} from '@angular/core';
import {WorkflowModule} from "../../model/workflow-module";
@Component({
  selector: 'app-connectathon-module-view',
  templateUrl: './connectathon-module-view.component.html',
  styleUrls: ['./connectathon-module-view.component.css']
})
export class ConnectathonModuleViewComponent {
  @Input() workflowModules: WorkflowModule[];

  launchWorkflow(module: WorkflowModule) {

  }
}
