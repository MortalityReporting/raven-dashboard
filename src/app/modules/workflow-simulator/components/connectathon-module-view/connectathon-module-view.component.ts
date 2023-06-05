import {Component, Input} from '@angular/core';
import {WorkflowModule} from "../../model/workflow-module";
import {Router} from "@angular/router";
@Component({
  selector: 'app-connectathon-module-view',
  templateUrl: './connectathon-module-view.component.html',
  styleUrls: ['./connectathon-module-view.component.css']
})
export class ConnectathonModuleViewComponent {
  @Input() workflowModules: WorkflowModule[];

  constructor(private router: Router,) {
  }
  launchWorkflow(module: WorkflowModule) {
    if(module.name === 'searchEdrs'){
      this.router.navigate(['/workflow-simulator/search-edrs']);
    }
    else if(module.name === 'onboarding'){
      this.router.navigate(['/workflow-simulator/onboarding']);
    }
  }
}
