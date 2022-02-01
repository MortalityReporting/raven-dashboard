import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {ValidateFhir} from "../../../validator/validate-fhir";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.css']
})
export class FhirValidatorComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  createForm(){
    this.form = this.formBuilder.group({
      fhirResource: new FormControl(null, [Validators.required, ValidateFhir],null),
    });
  }

  submit() {
    console.log(this.form);
  }

  onClear() {
    this.form.reset();
  }

  getErrorMessage(form: AbstractControl) {
    console.log("I am running");
  }

  ngOnInit() {
    this.createForm();
  }

}




