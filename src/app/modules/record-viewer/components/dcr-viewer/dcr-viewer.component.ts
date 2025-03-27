import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MdiToEdrsDocumentHandlerService} from "../../services/mdi-to-edrs-document-handler.service";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {UtilsService} from "../../../../service/utils.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {DcrDocumentHandlerService} from "../../services/dcr-document-handler.service";

@Component({
  selector: 'app-dcr-viewer',
  standalone: false,
  templateUrl: './dcr-viewer.component.html',
  styleUrl: './dcr-viewer.component.css'
})
export class DcrViewerComponent implements OnInit{
  dcrRecord: any;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public documentHandler: DcrDocumentHandlerService,
    private fhirExplorerService: FhirExplorerService,
    private utilsService: UtilsService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }


  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.documentHandler.getRecord(subjectId).subscribe({
      next: record => {
        this.fhirExplorerService.setSelectedFhirResource(record.documentBundle);
        this.dcrRecord = record;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Server error loading records.");
        this.isLoading = false;
      }
    });
  }
}
