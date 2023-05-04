import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseSummary} from "../../../models/case.summary";
import {CaseHeader} from "../../../models/case.header";
import {MatAccordion} from "@angular/material/expansion";
import {MdiToEdrsDocumentHandlerService} from "../../../services/mdi-to-edrs-document-handler.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModuleHeaderConfig} from "../../../../../../assets/configuration/module-header-config";
import {AppConfiguration} from "../../../../../../assets/configuration/app-configuration";
import {FhirResource} from "../../../../fhir-util/models/base/fhir.resource";

@Component({
  selector: 'record-viewer-case-summary-content',
  templateUrl: './case-summary-content.component.html',
  styleUrls: ['./case-summary-content.component.scss', '../../../record-viewer-styles.scss'],
})
export class CaseSummaryContentComponent implements OnInit {
  @Input() caseHeader$: Observable<CaseHeader>;
  @Input() caseSummary$: Observable<CaseSummary>;
  @Input() compositionId: string;
  @Input() documentBundle: FhirResource;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  name: string;
  license: string;
  phone:string;
  addressLine: string;

  idStateList = [
    { expanded: true,     id: 'caseAdminInfo' },
    { expanded: false,    id: 'demographics' },
    { expanded: false,    id: 'jurisdiction' },
    { expanded: false,    id: 'causeAndManner' },
    { expanded: false,    id: 'medicalHistory' },
    { expanded: false,    id: 'narratives' },
    { expanded: false,    id: 'circumstances' },
    { expanded: false,    id: 'examAndAutopsy' },
  ]

  ids = ["ID-1", "ID-2", "ID-3"];
  selectedId = "ID-1";

  author: any;

  constructor(
    private documentHandlerService: MdiToEdrsDocumentHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) {
  }

  ngOnInit(): void {

    this.caseHeader$.subscribe( caseHeader => {
      if (caseHeader?.authors != null)
      {
        let author = caseHeader.authors[0];
        this.author = caseHeader.authors[0];
        this.name = `${this.author.givenName[0] ?? ''} ${this.author.familyName ?? ''}`;
        if(!this.name?.length){
          this.name = this.documentHandlerService.defaultString
        }
        this.license = this.author.license ?? this.documentHandlerService.defaultString;
        this.phone = this.author.phoneNumber ?? this.documentHandlerService.defaultString;
        this.addressLine = `${author.line? author.line + '\n': ''}${this.author.city ? this.author.city + ', ' : ''} ${this.author.state ?? ''} ${this.author.postalCode ?? ''}`
        if(!this.addressLine?.trim()?.length){
          this.addressLine = this.documentHandlerService.defaultString;
        }
      }
    });
  }

  onToggleState(id: any ) {
    this.idStateList = this.idStateList.map(element => element.id == id ? {id: element.id, expanded: !element.expanded}: element);
  }

  onSetState(resourceId, state){
    this.idStateList = this.idStateList.map((element) => element.id === resourceId ? {id: element.id, expanded: true} : element);
    document.getElementById(resourceId).scrollIntoView({behavior: "smooth"});
  }

  onOpenAll() {
    this.idStateList.forEach(element => element.expanded = true);
    this.accordion.openAll()
  }

  onCloseAll() {
    this.idStateList.forEach(element => element.expanded = false);
    this.accordion.closeAll()
  }

  onOpenInComparisonTool() {
    this.router.navigate([this.appConfig.modules['recordComparison'].route, this.compositionId]);
  }

  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }

}
