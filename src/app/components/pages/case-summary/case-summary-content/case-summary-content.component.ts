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
  profiles: any = Profiles;
  ids = ["ID-1", "ID-2", "ID-3"];
  selectedId = "ID-1";

  constructor() {
    // console.log(this.profiles.Obs_DeathInjuryEventOccurredAtWork)
  }

  ngOnInit(): void {
  }

}
