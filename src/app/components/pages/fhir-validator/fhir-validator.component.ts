import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";

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
      fhirResource: new FormControl(null, [Validators.required]),
    });
  }

  submit() {
    console.log(this.form.value);
  }

  onClear() {
    this.form.reset();
  }

  ngOnInit() {
    this.createForm();
  }

}




