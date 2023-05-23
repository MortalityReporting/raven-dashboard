import {Component, Inject} from '@angular/core';
import { Router } from "@angular/router";
import {ModuleHeaderConfig} from "../../../providers/module-header-config";

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
    private router: Router) {
  }

  onStartWorkflow() {
    this.router.navigate(['/workflow-simulator/search-edrs']);
  }

  onStartOnboarding() {
    this.router.navigate(['/workflow-simulator/onboarding']);
  }
}
