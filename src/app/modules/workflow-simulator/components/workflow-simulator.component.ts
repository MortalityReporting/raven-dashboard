import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ModuleHeaderConfig} from "../../../providers/module-header-config";

import {WorkflowService} from "../service/workflow.service";
import {WorkflowModule} from "../model/workflow-module";
import {Observable} from "rxjs";
import {CurrentTest} from "../model/current-test";

/*
This is a top level component. It used to store workflow simulator children components.
*/

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.scss']
})

export class WorkflowSimulatorComponent implements OnInit {

  launchedTest : CurrentTest | null | undefined;

  testEvent: any;
  user: string;

  readonly viewList =
    [{name: 'Connechathon View', value: 'connechathonView'}, {name: 'Available Modules View', value: 'availableModulesView'}];
  selectedView = this.viewList[0];

  workflowModules: Observable<WorkflowModule[]>;

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private router: Router,
    private route: ActivatedRoute,
    private workflowService: WorkflowService) {
  }

  ngOnInit(): void {
    this.workflowModules = this.workflowService.workflowModules$;
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.testEvent = paramMap.get('testEvent');
      this.user = paramMap.get('user');
    });
  }

  protected readonly event = event;

  onTestSelected(event: CurrentTest) {
    this.launchedTest = event;
    console.log(this.launchedTest);
  }

  protected readonly CurrentTest = CurrentTest;
}
