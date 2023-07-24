import {Component, Input} from '@angular/core';
import {WorkflowModule} from "../../model/workflow-module";
import {WORKFLOW_MODULES, WorkflowService} from "../../service/workflow.service";

@Component({
  selector: 'app-available-module-view',
  templateUrl: './available-module-view.component.html',
  styleUrls: ['./available-module-view.component.css']
})
export class AvailableModuleViewComponent {
  workflowModules: WorkflowModule[];
  constructor(private workflowModuleService: WorkflowService){}
  ngOnInit(): void {
    this.workflowModuleService.setWorkflowModules(WORKFLOW_MODULES);
    this.workflowModuleService.workflowModules$.subscribe({
      next: value => this.workflowModules = value,
      error: err => console.error(err)
    })
  }
}
