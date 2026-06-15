import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FhirValidatorResultsExportService} from "../../../../service/fhir-validator-results-export.service";
import {MatCardModule} from "@angular/material/card";
import {FhirValidatorComponent} from "../fhir-validator/fhir-validator.component";
import {ValidatorInput} from "../../modal/validator-input-format";

@Component({
    selector: 'app-fhir-validator',
    templateUrl: './fhir-validator-wrapper.component.html',
    styleUrls: ['./fhir-validator-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCardModule,
    FhirValidatorComponent,
    FhirValidatorComponent
  ]
})
export class FhirValidatorWrapperComponent {
  constructor(
    @Inject('fhirValidatorConfig') public config: ModuleHeaderConfig,
    private fhirValidatorResultsExportService: FhirValidatorResultsExportService) {
  }

  validationTextFormat: ValidatorInput = {format: 'xml and json', accepts: 'text/*,.xml,.json'};

  onExportValidationResults(event: any){
    this.fhirValidatorResultsExportService.exportToPdf(event.jsonResource, event.resultsData);
  }

}
