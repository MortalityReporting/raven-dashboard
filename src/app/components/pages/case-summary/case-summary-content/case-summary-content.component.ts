import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseSummary} from "../../../../model/case-summary-models/case.summary";
import {MatAccordion} from "@angular/material/expansion";
import { Profiles } from "../../../../model/mdi/profile.list";

@Component({
  selector: 'app-case-summary-content',
  templateUrl: './case-summary-content.component.html',
  styleUrls: ['./case-summary-content.component.css'],
})
export class CaseSummaryContentComponent implements OnInit {
  @Input() caseSummary$: Observable<CaseSummary>;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  demographicsExpanded: boolean = true;
  circumstancesExpanded: boolean = false;
  causeAndMannerExpanded: boolean = false;
  medicalHistoryExpanded: boolean = false;
  examNotesExpanded: boolean = false;
  narrativesExpanded: boolean = false;
  deathCertificateExpanded: boolean = false;

  profiles: any = Profiles;
  ids = ["ID-1", "ID-2", "ID-3"];
  selectedId = "ID-1";

  constructor() {
  }

  ngOnInit(): void {
  }

  onOpenAll() {
    this.demographicsExpanded= true;
    this.circumstancesExpanded = true;
    this.causeAndMannerExpanded = true;
    this.medicalHistoryExpanded = true;
    this.examNotesExpanded = true;
    this.narrativesExpanded = true;
    this.deathCertificateExpanded = true;

    this.accordion.openAll()    
  }

  onCloseAll() {
    this.demographicsExpanded= false;
    this.circumstancesExpanded = false;
    this.causeAndMannerExpanded = false;
    this.medicalHistoryExpanded = false;
    this.examNotesExpanded = false;
    this.narrativesExpanded = false;
    this.deathCertificateExpanded = false;

    this.accordion.closeAll()
  }
}
