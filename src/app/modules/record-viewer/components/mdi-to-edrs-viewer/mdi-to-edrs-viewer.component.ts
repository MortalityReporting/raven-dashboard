import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {CaseHeader} from "../../models/case.header";
import {ActivatedRoute} from "@angular/router";
import {DecedentService} from "../../services/decedent.service";
import {MdiToEdrsDocumentHandlerService} from "../../services/mdi-to-edrs-document-handler.service";
import {FhirHelperService} from "../../../fhir-util";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {CaseSummaryContentComponent} from "../mdi-to-edrs/case-summary-content/case-summary-content.component";
import {CaseSummary} from "../../models/case.summary";
import {MatDrawer} from "@angular/material/sidenav";
import {FhirExplorerDrawerService} from "../../../fhir-explorer/services/fhir-explorer-drawer.service";

@Component({
  selector: 'app-mdi-to-edrs-viewer',
  templateUrl: './mdi-to-edrs-viewer.component.html',
  styleUrls: ['./mdi-to-edrs-viewer.component.css']
})
export class MdiToEdrsViewerComponent implements OnInit, OnDestroy{
  @ViewChild(CaseSummaryContentComponent) caseSummaryContentComponent: CaseSummaryContentComponent;
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
  compositionId: string;
  relatedToxicology$: Observable<any>;
  toxicologyRecordList: any[];
  documentBundle$: Observable<any>;
  sidenavExpanded = false;
  autosize: boolean = false;
  selectedAuthor = "VALUE NOT FOUND";

  @ViewChild('drawer') public drawer: MatDrawer;
  drawerWidth = "30%"
  drawerCollapsed = true;
  drawerStatus$: Subscription;
  currentRoute: string;


  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    public documentHandler: MdiToEdrsDocumentHandlerService,
    private fhirHelper: FhirHelperService,
    private fhirExplorerDrawerService: FhirExplorerDrawerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];

    this.decedentService.getComposition(subjectId).subscribe(
      {next: (compositionSearchBundle: any) => {
          const compositionId = compositionSearchBundle.entry[0].resource.id;
          this.documentBundle$ = this.documentHandler
            .getDocumentBundle(compositionId);
          this.compositionId = compositionId;
          this.documentBundle$.subscribe();
          const mdiCaseNumber = this.fhirHelper.getTrackingNumber(compositionSearchBundle.entry[0].resource);
          this.relatedToxicology$ = this.documentHandler.getRelatedToxicologyReports(mdiCaseNumber);
          this.relatedToxicology$.subscribe({
            next: value => {
              this.toxicologyRecordList = value
            }
          });
        }}
    );

    this.caseHeader$ = this.documentHandler.caseHeader$;
    this.caseSummary$ = this.documentHandler.caseSummary$;
    this.drawerStatus$ = this.fhirExplorerDrawerService.currentDrawerStatus.subscribe(
      (drawerOpened) => {
        if(!drawerOpened){
          this.drawerWidth = "30%";
          this.drawerCollapsed = true;
        }
      }
    );
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    this.caseSummaryContentComponent.onSetState(id, true);
  }
  ngAfterViewInit(): void {
    this.fhirExplorerDrawerService.setDrawer(this.drawer);
  }
  ngOnDestroy(): void {
    this.documentHandler.clearObservablesAndCashedData();
    this.fhirExplorerDrawerService.destroy();
    this.drawerStatus$.unsubscribe();
  }

  setDrawerWidth(drawerWidth: string): void {
    this.drawerCollapsed = !this.drawerCollapsed;
    this.drawerWidth = drawerWidth;
  }

}
