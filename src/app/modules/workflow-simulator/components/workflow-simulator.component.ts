import {Component, Inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModuleHeaderConfig} from "../../../providers/module-header-config";

import {WorkflowService} from "../service/workflow.service";
import {WorkflowModule} from "../model/workflow-module";
import {Observable} from "rxjs";

/*
This is a top level component. It used to store workflow simulator children components.
*/

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.scss']
})

export class WorkflowSimulatorComponent implements OnInit {

  readonly viewList =
    [{name: 'Connechathon View', value: 'connechathonView'}, {name: 'Available Modules View', value: 'availableModulesView'}];
  selectedView = this.viewList[0];

  workflowModules: Observable<WorkflowModule[]>;

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private router: Router,
    private workflowService: WorkflowService) {
  }

  onStartWorkflow() {
    this.router.navigate(['/workflow-simulator/search-edrs']);
  }

  onStartOnboarding() {
    this.router.navigate(['/workflow-simulator/onboarding']);
  }

  ngOnInit(): void {
    this.workflowModules = this.workflowService.workflowModules$;
  }
}
