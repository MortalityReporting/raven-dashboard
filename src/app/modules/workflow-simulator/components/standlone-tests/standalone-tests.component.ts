import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Test} from "../../models/test";
import {TestStatus} from "../../../testing-events";

@Component({
  selector: 'app-standalone-tests',
  templateUrl: './standalone-tests.component.html',
  styleUrls: ['./standalone-tests.component.css']
})
export class StandaloneTestsComponent {

  standaloneTests: Test[] = [
    {
      name: 'onboarding',
      display: 'Onboarding',
      description: "Onboarding module description",
      status: TestStatus.notStarted
    },
    {
      name: 'search-edrs',
      display: 'Search EDRS',
      description: "The \"EDRS Search\" workflow simulates '" +
        "searching cases in an Electronic Death Registration System (EDRS). Testers representing Medical Examiners/Coroners (ME/Cs) " +
        "can provide search parameters executed against the BlueJay EDRS test server, which implements the MDI Documents FHIR " +
        "Operation for search. Supported parameters include primary case identification fields, as well as additional data " +
        "(e.g., demographics information) if it exists in the test EDRS case records. Search parameters and all relevant " +
        "HTTP requests and responses are provided in both human readable forms and as FHIR resources for demonstration.",
      status: TestStatus.notStarted
    },
    {
      name: 'updateEdrs',
      display: 'Update EDRS',
      description: "Onboarding module description",
      status: TestStatus.notStarted
    },
  ];

  constructor(private router: Router) {
  }

  onStartTest(test: Test) {
    this.router.navigate([`/workflow-simulator/${test.name}`]);
  }
}
