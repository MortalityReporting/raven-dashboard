import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FhirExplorerService} from "../../../fhir-explorer/services/fhir-explorer.service";
import {UtilsService} from "../../../../service/utils.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {DcrDocumentHandlerService} from "../../services/dcr-document-handler.service";
import {DcrViewerContentComponent} from "./dcr-viewer-content/dcr-viewer-content.component";

@Component({
  selector: 'app-dcr-viewer',
  standalone: false,
  templateUrl: './dcr-viewer.component.html',
  styleUrl: './dcr-viewer.component.css'
})
export class DcrViewerComponent implements OnInit{

  @ViewChild(DcrViewerContentComponent) contentComponent: DcrViewerContentComponent;
  dcrRecord: any;
  isLoading: boolean = false;
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
    this.isLoading = true;
    this.dcrDocumentHandler.getById(recordId).subscribe({
      next: data => {
        this.isLoading = false;
        this.dcrRecord = data;
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Server error loading records.");
        this.isLoading = false;
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
