import {Component, output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";

@Component({
  selector: 'app-dcr-submit-form',
  standalone: false,
  templateUrl: './dcr-submit-form.component.html',
  styleUrls: ['./dcr-submit-form.component.scss', '../death-certificate-review-submission.component.scss']
})
export class DcrSubmitFormComponent {

  @ViewChild('formDirective') formDirective: FormGroupDirective;

  submitToExternalApi = output<{username?: string, password?: string, externalApiUrl?: string}>();

  dcrSubmitToApiForm = new FormGroup({
    externalApiUrl: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if(this.dcrSubmitToApiForm.valid) {
      this.submitToExternalApi.emit(this.dcrSubmitToApiForm.value);
    }
  }

  onClearFormData() {
    this.dcrSubmitToApiForm.reset();
    this.formDirective.resetForm();
  }
}
