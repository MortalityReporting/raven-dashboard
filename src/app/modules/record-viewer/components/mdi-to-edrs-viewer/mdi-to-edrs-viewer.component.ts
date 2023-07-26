import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseHeader} from "../../models/case.header";
import {ActivatedRoute} from "@angular/router";
import {MdiToEdrsDocumentHandlerService} from "../../services/mdi-to-edrs-document-handler.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {CaseSummary} from "../../models/case.summary";
import {MdiToEdrsViewerContentComponent} from "./mdi-to-edrs-viewer-content/mdi-to-edrs-viewer-content.component";
import {MdiToEdrsRecord} from "../../models/mdiToEdrsRecord";

@Component({
  selector: 'app-mdi-to-edrs-viewer',
  templateUrl: './mdi-to-edrs-viewer.component.html',
  styleUrls: ['./mdi-to-edrs-viewer.component.css']
})
export class MdiToEdrsViewerComponent implements OnInit, OnDestroy {
  @ViewChild(MdiToEdrsViewerContentComponent) contentComponent: MdiToEdrsViewerContentComponent;

  /** Inputs to children **/
  mdiToEdrsRecord: MdiToEdrsRecord;
  mdiToEdrsRecord$: Observable<any>;
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
  composition$: Observable<any>;
  documentBundle: any = {};
  compositionId: string = "";
  toxicologyRecordList: any[] = [];

  relatedToxicology$: Observable<any>;
  documentBundle$: Observable<any>;
  sidenavExpanded = false;
  autosize: boolean = false;
  selectedAuthor = "VALUE NOT FOUND";

  drawerWidth = "30%"
  drawerCollapsed = true;
  currentRoute: string;


  constructor(
    private route: ActivatedRoute,
    public documentHandler: MdiToEdrsDocumentHandlerService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
    // TODO: Move these to appropriate children or make not observables passed as input.
    this.mdiToEdrsRecord$ = this.documentHandler.getRecord(subjectId);
    this.caseHeader$ = this.documentHandler.caseHeader$;
    this.caseSummary$ = this.documentHandler.caseSummary$;
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    // this.caseSummaryContentComponent.onSetState(id, true);
  }

  ngOnDestroy(): void {
    this.documentHandler.clearObservablesAndCashedData();
  }

  setDrawerWidth(drawerWidth: string): void {
    this.drawerCollapsed = !this.drawerCollapsed;
    this.drawerWidth = drawerWidth;
  }

}
