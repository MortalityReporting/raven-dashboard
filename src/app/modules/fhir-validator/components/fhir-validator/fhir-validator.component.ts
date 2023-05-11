import {Component, Inject} from '@angular/core';
import {ValidatorInput} from "ngx-fhir-validator";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.scss']
})
export class FhirValidatorComponent {
  constructor(
    @Inject('fhirValidatorConfig') public config: ModuleHeaderConfig) {
  }


  validationTextFormat: ValidatorInput = {format: 'xml and json', accepts: 'text/*,.xml,.json'};

}
