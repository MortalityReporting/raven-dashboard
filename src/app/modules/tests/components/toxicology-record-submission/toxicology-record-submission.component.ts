import {Component, Inject} from '@angular/core';
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";

@Component({
  selector: 'app-toxicology-record-submission',
  standalone: false,
  templateUrl: './toxicology-record-submission.component.html',
  styleUrl: './toxicology-record-submission.component.scss'
})
export class ToxicologyRecordSubmissionComponent{
  constructor(
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig
  ){
  }

}
