import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.css']
})
export class FhirValidatorComponent implements OnInit {

  form: FormGroup;
  fhirResource = new FormControl('fhirResource');
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.form = this.formBuilder.group({
      fhirResource: new FormControl(),
    });
    this.form.valueChanges.subscribe(data => console.log(data));
  }

  submit() {
    console.log(this.form.value);
  }
}




