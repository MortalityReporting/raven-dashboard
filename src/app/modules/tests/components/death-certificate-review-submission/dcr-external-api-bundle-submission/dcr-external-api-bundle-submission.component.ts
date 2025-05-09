import {Component, Inject, inject, OnInit, ViewChild} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators
} from "@angular/forms";
import {DeathCertificateReviewService} from "../../../services/death-certificate-review.service";
import {UtilsService} from "../../../../../service/utils.service";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";

@Component({
  selector: 'app-dcr-external-api-bundle-submission',
  standalone: false,
  templateUrl: './dcr-external-api-bundle-submission.component.html',
  styleUrls: ['./dcr-external-api-bundle-submission.component.scss', '../death-certificate-review-submission.component.scss']
})
export class DcrExternalApiBundleSubmission implements OnInit{

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private fb: FormBuilder,
  ) {}

  dcrSubmitToApiForm: FormGroup;

  @ViewChild('formDirective') formDirective: FormGroupDirective;
  errorResponse: any;
  successResponse: any;
  requestHeaders: any;

  deathCertificateReviewService = inject(DeathCertificateReviewService);
  utilsService = inject(UtilsService)
  isFhirBundleMissing = false;


  onSubmit() {
    // Transform parameters to the format required by your API if needed
    const formValue = this.dcrSubmitToApiForm.value;
    this.errorResponse = null;
    this.successResponse = null;
    if(this.dcrSubmitToApiForm.valid) {
      if(this.deathCertificateReviewService.fhirBundle()) {
        this.isFhirBundleMissing = false;
        this.deathCertificateReviewService.submitToExternalApi(formValue, this.deathCertificateReviewService.fhirBundle()).subscribe({
          next: (value) => {
            this.utilsService.showSuccessMessage("FHIR Bundle was submitted successfully!");
            this.successResponse = value;
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

  ngOnInit(): void {
    this.initForm();
  }

  addParameter(): void {
    const parameterGroup = this.fb.group({
      paramKey: [''],
      paramValue: ['']
    });

    (this.dcrSubmitToApiForm.get('parameters') as FormArray).push(parameterGroup);
  }

  // Remove a parameter at specified index
  removeParameter(index: number): void {
    (this.dcrSubmitToApiForm.get('parameters') as FormArray).removeAt(index);
  }


  private initForm(): void {
    this.dcrSubmitToApiForm = this.fb.group({
      externalApiUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      parameters: this.fb.array([])
    });
    this.addParameter();
  }


  get parameterControls(): FormGroup[] {
    return (this.dcrSubmitToApiForm.get('parameters') as FormArray).controls as FormGroup[];
  }

}
