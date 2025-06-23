import {Component, inject, Inject, signal} from '@angular/core';
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ToxicologyGridDto} from "../../../../model/toxicology.grid.dto";
import {ToxToMdiMessageHandlerService} from "../../../record-viewer";
import {ExternalApiSubmissionService} from "../../services/external-api-submission.service";

@Component({
  selector: 'test-toxicology-record-submission',
  standalone: false,
  templateUrl: './toxicology-record-submission.component.html',
  styleUrl: './toxicology-record-submission.component.scss'
})
export class ToxicologyRecordSubmissionComponent{
  selectedToxRecord = signal<any>(null);
  externalApiSubmissionService = inject(ExternalApiSubmissionService);

  constructor(
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private toxicologyHandler: ToxToMdiMessageHandlerService
  ){}

  isLoadingData = false;

  onToxRecordSelected(toxRecordDto: ToxicologyGridDto) {
    this.getToxRecordDetails(toxRecordDto);
  }

  private getToxRecordDetails(toxRecordDto: ToxicologyGridDto) {
    this.isLoadingData = true;
    this.externalApiSubmissionService.setJsonRecord(null);
    this.toxicologyHandler.getRecord(toxRecordDto.toxcasenumber).subscribe({
      next: record => {
        this.isLoadingData = false;
        if(record?.messageBundle){
          this.selectedToxRecord.set(record);
          this.externalApiSubmissionService.setJsonRecord(record.messageBundle);
        }
        else {
          console.warn("No message bundle found")
        }
      },
      error: err => {
        console.error(err);
        this.isLoadingData = false;
      }
    });
  }
}
