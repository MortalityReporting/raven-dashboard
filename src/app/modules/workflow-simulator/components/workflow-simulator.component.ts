import {Component, Inject} from '@angular/core';
import { Router } from "@angular/router";
import {ModuleHeaderConfig} from "../../../providers/module-header-config";
import {UserProfileManagerService} from "../../user-management";
import {tap} from "rxjs";
import {UserProfile} from "../../user-management/models/user-profile";

/*
This is a top level component. It used to store workflow simulator children components.
 */

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.scss']
})

export class WorkflowSimulatorComponent {

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private router: Router,
    private userProfileManager: UserProfileManagerService) {
  }

  onStartWorkflow() {
    this.router.navigate(['/workflow-simulator/search-edrs']);
  }
}
