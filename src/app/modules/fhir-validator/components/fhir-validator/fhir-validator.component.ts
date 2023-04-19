import {Component} from '@angular/core';
import {ValidatorInput} from "ngx-fhir-validator";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.scss']
})
export class FhirValidatorComponent {

  validationTextFormat: ValidatorInput = {format: 'xml and json', accepts: 'text/*,.xml,.json'};

}
