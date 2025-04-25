import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {DeathCertificateReviewService} from "../../../services/death-certificate-review.service";
import {UtilsService} from "../../../../../service/utils.service";

@Component({
  selector: 'app-dcr-external-api-bundle-submission',
  standalone: false,
  templateUrl: './dcr-external-api-bundle-submission.component.html',
  styleUrls: ['./dcr-external-api-bundle-submission.component.scss', '../death-certificate-review-submission.component.scss']
})
export class DcrExternalApiBundleSubmission {

  @ViewChild('formDirective') formDirective: FormGroupDirective;

  fhirBundle = this.deathCertificateReviewService.fhirBundle();
  isFhirBundleMissing = false;

  constructor(private deathCertificateReviewService: DeathCertificateReviewService, private utilsService: UtilsService) {}

  dcrSubmitToApiForm = new FormGroup({
    externalApiUrl: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if(this.dcrSubmitToApiForm.valid) {
      if(this.fhirBundle?.value()) {
        this.isFhirBundleMissing = false;
        this.deathCertificateReviewService.submitToExternalApi(this.dcrSubmitToApiForm.value, this.fhirBundle).subscribe({
          next: (value) => {
            this.utilsService.showSuccessMessage("FHIR Bundle was submitted successfully!.");
          },
          error: (err) => {
            console.log(err);
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
  }


}
