import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ValidatorCoreComponent} from "../validator-core/validator-core.component";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.scss']
})
export class FhirValidatorComponent implements OnInit {

  @Input() isStandalone: boolean = true;
  @Input() renderValidationDetails: any;

  @ViewChild(ValidatorCoreComponent) validatorCore: FhirValidatorComponent;

  constructor() { }

  validateFhirResource(resource?: any, recourseFormat?: string){
    this.validatorCore.validateFhirResource(resource, recourseFormat);
  }

  clearValidationErrors(){
    this.validatorCore.clearValidationErrors();
  }

  clearUI(){
    this.validatorCore.clearUI();
  }

  ngOnInit(): void {
  }

}
