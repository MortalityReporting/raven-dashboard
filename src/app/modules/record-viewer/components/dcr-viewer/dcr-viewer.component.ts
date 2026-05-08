import {Component, Inject, OnInit, ViewChild, signal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {UtilsService} from "../../../../service/utils.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {DcrDocumentHandlerService} from "../../services/dcr-document-handler.service";
import {DcrViewerContentComponent} from "./dcr-viewer-content/dcr-viewer-content.component";
import {FhirExplorerModule} from "../../../fhir-explorer/fhir-explorer.module";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {DecedentDisplayComponent} from "../decedent-display/decedent-display.component";
import {RecordViewerModule} from "../../record-viewer.module";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-dcr-viewer',
  templateUrl: './dcr-viewer.component.html',
  imports: [
    FhirExplorerModule,
    MatIcon,
    MatTooltip,
    DecedentDisplayComponent,
    RecordViewerModule,
    MatProgressSpinner
  ],
  styleUrl: './dcr-viewer.component.css'
})
export class DcrViewerComponent implements OnInit{

  @ViewChild(DcrViewerContentComponent) contentComponent: DcrViewerContentComponent;
  dcrRecord = signal<any>(null);
  isLoading = signal<boolean>(false);
  showFhirExplorerDrawer = false;
  showDrawer = [this.showFhirExplorerDrawer];

  constructor(
    private route: ActivatedRoute,
    public dcrDocumentHandler: DcrDocumentHandlerService,
    private fhirExplorerService: FhirExplorerService,
    private utilsService: UtilsService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }


  ngOnInit(): void {
    let recordId = this.route.snapshot.params['id'];
    this.isLoading.set(true);
    this.dcrDocumentHandler.getById(recordId).subscribe({
      next: data => {
        this.isLoading.set(false);
        this.dcrRecord.set(data);
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Server error loading records.");
        this.isLoading.set(false);
      }
    });
  }

  onItemClick(id: string) {
    this.contentComponent.onSetState(id);
  }

  closeAllDrawers() {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
  }

  openDrawer(index: number) {
    this.showDrawer = new Array(this.showDrawer.length).fill(false);
    this.showDrawer[index] = true;
  }
}
