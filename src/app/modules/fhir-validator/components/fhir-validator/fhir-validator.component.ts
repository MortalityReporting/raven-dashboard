import {Component, Inject} from '@angular/core';
import {ValidatorInput} from "ngx-fhir-validator";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FhirValidatorResultsExportService} from "../../../../service/fhir-validator-results-export.service";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.scss']
})
export class FhirValidatorComponent {
  constructor(
    @Inject('fhirValidatorConfig') public config: ModuleHeaderConfig,
    private fhirValidatorResultsExportService: FhirValidatorResultsExportService) {
  }

  validationTextFormat: ValidatorInput = {format: 'xml and json', accepts: 'text/*,.xml,.json'};

  onExportValidationResults(event: any){
    this.fhirValidatorResultsExportService.exportToPdf(event.jsonResource, event.resultsData);
  }

}
