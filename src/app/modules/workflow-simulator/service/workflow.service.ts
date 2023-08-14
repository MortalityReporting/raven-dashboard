import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Test} from "../models/test";
import {TestStatus} from "../../testing-events";

// TODO I theory one day this could be data driven and not a constant. Presently we just use the constant from the UI
export const CURRENT_TESTS: Test[] = [
  new Test('onboarding', 'Onboarding', 1, "Onboarding module description",
    TestStatus.notStarted),
  new Test('search-edrs', 'Search EDRS', 0,'The "EDRS Search" workflow simulates ' +
    'searching cases in an Electronic Death Registration System (EDRS). Testers representing Medical Examiners/Coroners (ME/Cs) ' +
    'can provide search parameters executed against the BlueJay EDRS test server, which implements the MDI Documents FHIR ' +
    'Operation for search. Supported parameters include primary case identification fields, as well as additional data ' +
    '(e.g., demographics information) if it exists in the test EDRS case records. Search parameters and all relevant ' +
    'HTTP requests and responses are provided in both human readable forms and as FHIR resources for demonstration.',
    TestStatus.notStarted),
  new Test('updateEdrs', 'Update EDRS', 2, "Update EDRS module description", TestStatus.notStarted),
]

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private testList= new BehaviorSubject<Test[]>([]);
  testList$ = this.testList.asObservable();
  setTestList(testList: Test[]) {
    this.testList.next(testList);
  }

  constructor() {
    this.setTestList(CURRENT_TESTS);
  }
}
