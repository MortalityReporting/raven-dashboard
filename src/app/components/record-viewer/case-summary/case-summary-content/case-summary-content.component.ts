import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseSummary} from "../../../../model/record-models/case.summary";
import {Author, CaseHeader} from "../../../../model/record-models/case.header";
import {MatAccordion} from "@angular/material/expansion";
import {Profiles} from "../../../../model/mdi/profile.list";
import {FhirResourceProviderService} from "../../../../service/fhir-resource-provider.service";
import {DocumentHandlerService} from "../../../../service/document-handler.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-case-summary-content',
  templateUrl: './case-summary-content.component.html',
  styleUrls: ['./case-summary-content.component.css'],
})
export class CaseSummaryContentComponent implements OnInit {
  @Input() caseHeader$: Observable<CaseHeader>;
  @Input() caseSummary$: Observable<CaseSummary>;
  @Input() compositionId: string;
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

  profiles: any = Profiles;
  ids = ["ID-1", "ID-2", "ID-3"];
  selectedId = "ID-1";

  author: any;

  constructor(
    private fhirResourceProviderService: FhirResourceProviderService,
    private documentHandlerService: DocumentHandlerService,
    private route: ActivatedRoute,
    private router: Router,
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
      this.idStateList = this.idStateList.map(element => element.id == resourceId ? {id: element.id, expanded: state} : element);
  }

  onOpenAll() {
    this.idStateList.forEach(element => element.expanded = true);
    this.accordion.openAll()
  }

  onCloseAll() {
    this.idStateList.forEach(element => element.expanded = false);
    this.accordion.closeAll()
  }

  onNotImplementedItemSelected() {
    this.fhirResourceProviderService.setSelectedFhirResource(null);
  }

  onAuthorSelected() {
    if(this.author){
      this.fhirResourceProviderService.setSelectedFhirResource(this.author);
    }
  }

  onOpenInComparisonTool() {
    this.router.navigate(['comparison/', this.compositionId]);
  }

  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }
}
