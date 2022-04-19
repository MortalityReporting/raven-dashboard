import { Component, OnInit } from '@angular/core';
import {DocumentHandlerService} from "../../service/document-handler.service";
import {Observable} from "rxjs";
import {CaseSummary} from "../../model/case-summary-models/case.summary";

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.css']
})
export class FhirExplorerComponent implements OnInit {

  selectedStructure: string = 'json';
  caseSummary$: Observable<CaseSummary>;

  constructor(
    public documentHandler: DocumentHandlerService
  ) { }

  ngOnInit(): void {
    this.caseSummary$ = this.documentHandler.caseSummary$;
  }

}
