import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WorkflowModule} from "../../model/workflow-module";
import {Router} from "@angular/router";
import {CurrentTest} from "../../model/current-test";
@Component({
  selector: 'app-connectathon-module-view',
  templateUrl: './connectathon-module-view.component.html',
  styleUrls: ['./connectathon-module-view.component.css']
})
export class ConnectathonModuleViewComponent {
  @Input() workflowModules: WorkflowModule[];
  @Output() testSelectedEvent = new EventEmitter<CurrentTest>();
  constructor(private router: Router,) {
  }
  launchWorkflow(module: WorkflowModule) {
    if(module.name.toLowerCase() === CurrentTest.searchEDRS.toLowerCase()){
      this.testSelectedEvent.emit(CurrentTest.searchEDRS);
    }
    else if(module.name.toLowerCase() === CurrentTest.onboarding.toLowerCase()){
      this.testSelectedEvent.emit(CurrentTest.onboarding);
    }
  }
}
