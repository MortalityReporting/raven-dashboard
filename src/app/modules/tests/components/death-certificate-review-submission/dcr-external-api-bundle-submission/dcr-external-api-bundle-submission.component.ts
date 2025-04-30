import {Component, Inject, inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {DeathCertificateReviewService} from "../../../services/death-certificate-review.service";
import {UtilsService} from "../../../../../service/utils.service";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";

@Component({
  selector: 'app-dcr-external-api-bundle-submission',
  standalone: false,
  templateUrl: './dcr-external-api-bundle-submission.component.html',
  styleUrls: ['./dcr-external-api-bundle-submission.component.scss', '../death-certificate-review-submission.component.scss']
})
export class DcrExternalApiBundleSubmission {

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig
  ) {}

  @ViewChild('formDirective') formDirective: FormGroupDirective;
  errorResponse: any;

  deathCertificateReviewService = inject(DeathCertificateReviewService);
  utilsService = inject(UtilsService)
  isFhirBundleMissing = false;


  dcrSubmitToApiForm = new FormGroup({
    externalApiUrl: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.errorResponse = null;
    if(this.dcrSubmitToApiForm.valid) {
      if(this.deathCertificateReviewService.fhirBundle()) {
        this.isFhirBundleMissing = false;
        this.deathCertificateReviewService.submitToExternalApi(this.dcrSubmitToApiForm.value, this.deathCertificateReviewService.fhirBundle()).subscribe({
          next: (value) => {
            this.utilsService.showSuccessMessage("FHIR Bundle was submitted successfully!");
          },
          error: (err) => {
            console.error(err);
            this.errorResponse = err;
            this.utilsService.showErrorMessage("FHIR Bundle submission failed!");
          }
        })
      }
      else {
        this.isFhirBundleMissing = true;
      }
    }
  }

  onClearFormData() {
    this.dcrSubmitToApiForm.reset();
    this.formDirective.resetForm();
    this.isFhirBundleMissing = false;
    this.errorResponse = null;
  }


}
