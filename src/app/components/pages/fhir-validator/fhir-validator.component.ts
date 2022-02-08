import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, NgForm,
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
  @ViewChild('formDirective') formDirective: NgForm;

  constructor(private formBuilder: FormBuilder) {}

  createForm(){
    this.form = this.formBuilder.group({
      fhirResource: new FormControl(null, [Validators.required, ValidateFhir],null),
    }, { updateOn: 'submit'});
  }

  submit() {
    if(this.form.valid) {
     // this.formDirective.resetForm();
    }
  }

  onClear() {
    // We need to reset the form directive and not the form.
    // We also need to use set timeout, or required values will render mat-error messages
    setTimeout(() => this.formDirective.resetForm(), 0)
  }

  getErrorMessage(form: AbstractControl) {
    console.log("I am running");
  }

  ngOnInit() {
    this.createForm();
  }

}




