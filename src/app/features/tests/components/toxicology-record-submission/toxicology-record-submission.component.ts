import {Component, inject, Inject, signal} from '@angular/core';
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ToxicologyGridDto} from "../../../../model/toxicology.grid.dto";
import {ToxToMdiMessageHandlerService} from "../../../record-viewer";
import {ExternalApiSubmissionService} from "../../services/external-api-submission.service";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { ToxicologyGridComponent } from '../../../record-viewer/components/search-records/toxicology-grid/toxicology-grid.component';
import { ToxRecordDetailsComponent } from './tox-record-details/tox-record-details.component';
import { MatIcon } from '@angular/material/icon';
import { ExternalApiDataSubmission } from '../external-api-data-submission/external-api-data-submission.component';

@Component({
    selector: 'test-toxicology-record-submission',
    templateUrl: './toxicology-record-submission.component.html',
    styleUrl: './toxicology-record-submission.component.scss',
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, ToxicologyGridComponent, ToxRecordDetailsComponent, MatIcon, ExternalApiDataSubmission]
})
export class ToxicologyRecordSubmissionComponent{
  selectedToxRecord = signal<any>(null);
  selectedRecordDTO = signal<ToxicologyGridDto>(null);

  externalApiSubmissionService = inject(ExternalApiSubmissionService);

  constructor(
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private toxicologyHandler: ToxToMdiMessageHandlerService
  ){}

  isLoading = signal(false);

  onToxRecordSelected(toxRecordDto: ToxicologyGridDto) {
    this.selectedRecordDTO.set(toxRecordDto);
    this.getToxRecordDetails(toxRecordDto);
  }

  private getToxRecordDetails(toxRecordDto: ToxicologyGridDto) {
    this.isLoading.set(true);
    this.externalApiSubmissionService.setJsonRecord(null);
    this.toxicologyHandler.getRecord(toxRecordDto.toxcasenumber).subscribe({
      next: record => {
        this.isLoading.set(false);
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
        this.isLoading.set(false);
      }
    });
  }
}
