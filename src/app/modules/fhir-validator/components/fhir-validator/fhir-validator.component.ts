import {Component, Inject} from '@angular/core';
import {ValidatorInput, NgxFhirValidatorComponent} from "ngx-fhir-validator";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FhirValidatorResultsExportService} from "../../../../service/fhir-validator-results-export.service";
import {MatCardModule} from "@angular/material/card";

@Component({
    selector: 'app-fhir-validator',
    templateUrl: './fhir-validator.component.html',
    styleUrls: ['./fhir-validator.component.scss'],
    imports: [
        MatCardModule,
        NgxFhirValidatorComponent
    ]
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
