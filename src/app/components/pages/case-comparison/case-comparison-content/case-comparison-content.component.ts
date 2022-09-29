import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {CaseSummary} from "../../../../model/case-summary-models/case.summary";
import {CaseHeader} from "../../../../model/case-summary-models/case.header";
import {MatAccordion} from "@angular/material/expansion";
import * as Diff from 'diff';

@Component({
  selector: 'app-case-comparison-content',
  templateUrl: './case-comparison-content.component.html',
  styleUrls: ['./case-comparison-content.component.css'],
})
export class CaseComparisonContentComponent implements OnInit {
  @Input() caseHeader$: Observable<CaseHeader>;
  @Input() caseSummary$: Observable<CaseSummary>;
  @Input() patientResource$: Observable<any>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  caseAdminInfoExpanded: boolean = false;
  demographicsExpanded: boolean = false;
  circumstancesExpanded: boolean = false;
  jurisdictionExpanded: boolean = false;
  causeAndMannerExpanded: boolean = false;
  medicalHistoryExpanded: boolean = false;
  examNotesExpanded: boolean = false;
  narrativesExpanded: boolean = false;
  deathCertificateExpanded: boolean = false;

  patientResource: any;

  patientActual: string;
  patientExpected: string;
  patientDifference: string;

  testCases = [
    {
      givenName: "Whago",
      familyName: "Brox"
    }
  ]

  _selectedTestCase = this.testCases[0];

  constructor() {
  } 

  ngOnInit(): void {

    this.patientResource$.subscribe( patientResource => {
      this.patientResource = patientResource;

      let oldObj = {
        "name": [{
          "use": "official",
          "family": "Rogers",
          "given": "Jasmine",
        } ],
        "gender": "female",
        "birthDate": "1966-06-15",
        "address": [ {
          "use": "home",
          "line": [ "400 Windstream Street" ],
          "city": "Atlanta",
          "district": "Fulton",
          "state": "GA"
       }]
      }

      let newObj = {
        "nome": [{
          "use": "official",
          "family": "Rogers",
          "given": "Jasmine",
        } ],
        "gender": "male",
        "birthDate": "1966-06-15",
        "address": [ {
          "use": "home",
          "line": [ "400 Windstream Street" ],
          "city": "Atlanta",
          "district": "Fulton",
          "state": "GA"
        }]
      }

      this.patientActual = JSON.stringify( oldObj, null, 4 );
      this.patientExpected = JSON.stringify( newObj, null, 4 );

      let parts = Diff.diffChars( this.patientActual, this.patientExpected );

      var html = "<pre>";

      parts.map( part => {
        let span = "<span>";

        if (part.added != undefined && part.added == true)
        {
          span = '<span class="diff-added-color">';
        }
        else if (part.removed != undefined && part.removed == true)
        {
          span = '<span class="diff-removed-color">';
        }

        html += span + part.value + '</span>';
      });

      html += "</pre>";
      
      this.patientDifference = html;
    });
  }

  selectedTestCase(): string {
    return this._selectedTestCase.givenName + " " + this._selectedTestCase.familyName;
  }

  onItemClick( id: any )
  {  
    switch (id)
    {
      case 'caseAdminInfo': this.caseAdminInfoExpanded = !this.caseAdminInfoExpanded; break;      
      case 'demographics': this.demographicsExpanded = !this.demographicsExpanded; break;
      case 'circumstances':  this.circumstancesExpanded = !this.circumstancesExpanded; break;
      case 'jurisdiction': this.jurisdictionExpanded = !this.jurisdictionExpanded; break;
      case 'causeAndManner': this.causeAndMannerExpanded = !this.causeAndMannerExpanded; break;
      case 'medicalHistory': this.medicalHistoryExpanded = !this.medicalHistoryExpanded; break;
      case 'examNotes': this.examNotesExpanded = !this.examNotesExpanded; break;
      case 'narratives': this.narrativesExpanded = !this.narrativesExpanded; break;
      case 'deathCertificate': this.deathCertificateExpanded = !this.deathCertificateExpanded; break;
    }
  }
}
