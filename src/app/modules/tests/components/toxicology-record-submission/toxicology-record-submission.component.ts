import {Component, Inject, signal} from '@angular/core';
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ToxicologyGridDto} from "../../../../model/toxicology.grid.dto";
import {ToxToMdiMessageHandlerService} from "../../../record-viewer";

@Component({
  selector: 'test-toxicology-record-submission',
  standalone: false,
  templateUrl: './toxicology-record-submission.component.html',
  styleUrl: './toxicology-record-submission.component.scss'
})
export class ToxicologyRecordSubmissionComponent{
  selectedToxRecord = signal<any>(null);
  constructor(
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private toxicologyHandler: ToxToMdiMessageHandlerService
  ){}

  onToxRecordSelected(toxRecordDto: ToxicologyGridDto) {
    this.getToxRecordDetails(toxRecordDto);
  }

  private getToxRecordDetails(toxRecordDto: ToxicologyGridDto) {
    this.toxicologyHandler.getRecord(toxRecordDto.toxcasenumber).subscribe({
      next: record => {
        console.log(record);
        if(record?.messageBundle){
          this.selectedToxRecord.set(record);
        }
        else {
          console.warn("No message bundle found")
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
