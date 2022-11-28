import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {CaseSummary} from "../model/case-summary-models/case.summary";

@Injectable({
  providedIn: 'root'
})
export class WorkflowSimulatorService {
  private selectedCase = new Subject<any>();
  selectedCase$ = this.selectedCase.asObservable();

  constructor() { }

  setSelectedCase(caseData): void {
    this.selectedCase.next(caseData);
  }
}
