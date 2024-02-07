import {Component, Inject} from '@angular/core';
import {ImplementationGuide, ValidatorInput} from "ngx-fhir-validator";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FhirValidatorResultsExportService} from "../../../../service/fhir-validator-results-export.service";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.scss']
})
export class FhirValidatorComponent {
  igList: ImplementationGuide[] = [
    {
      "name": "mdi#1.1.0",
      "valueString": "hl7.fhir.us.mdi#1.1.0",
      "display": "MDI FHIR IG - 1.1.0"
    },
    {
      "name": "mdi#current",
      "valueString": "hl7.fhir.us.mdi#current",
      "display": "MDI FHIR IG - Current"
    },
    {
      "name": "vrdr#2.2.0",
      "valueString": "hl7.fhir.us.vrdr#2.2.0",
      "display": "VRDR FHIR IG - 2.2.0"
    }
  ];

  constructor(
    @Inject('fhirValidatorConfig') public config: ModuleHeaderConfig,
    private fhirValidatorResultsExportService: FhirValidatorResultsExportService) {
  }

  validationTextFormat: ValidatorInput = {format: 'xml and json', accepts: 'text/*,.xml,.json'};

  onExportValidationResults(event: any){
    this.fhirValidatorResultsExportService.exportToPdf(event.jsonResource, event.resultsData);
  }

}
