import {Component, Inject, inject, OnInit, ViewChild} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators
} from "@angular/forms";
import {UtilsService} from "../../../../service/utils.service";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ExternalApiSubmissionService} from "../../services/external-api-submission.service";

@Component({
  selector: 'app-external-api-data-submission',
  standalone: false,
  templateUrl: './external-api-data-submission.component.html',
  styleUrls: ['./external-api-data-submission.component.scss', '../death-certificate-review-submission/death-certificate-review-submission.component.scss']
})
export class ExternalApiDataSubmission implements OnInit{

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private fb: FormBuilder,
  ) {}

  submitToApiForm: FormGroup;
  requestHeader: any;

  @ViewChild('formDirective') formDirective: FormGroupDirective;
  errorResponse: any;
  successResponse: any;

  externalApiSubmissionService = inject(ExternalApiSubmissionService);
  utilsService = inject(UtilsService)
  isFhirBundleMissing = false;


  onSubmit() {
    // Transform parameters to the format required by your API if needed
    const formValue = this.submitToApiForm.value;
    this.errorResponse = null;
    this.successResponse = null;
    this.externalApiSubmissionService.setRequestHeader(null);
    if(this.submitToApiForm.valid) {
      if(this.externalApiSubmissionService.jsonRecord()) {
        this.isFhirBundleMissing = false;
        this.externalApiSubmissionService.submitToExternalApi(formValue, this.externalApiSubmissionService.jsonRecord()).subscribe({
          next: (value) => {
            this.utilsService.showSuccessMessage("Data Submitted Successfully!");
            this.successResponse = value;
            this.requestHeader = this.externalApiSubmissionService.requestHeader();
          },
          error: (err) => {
            console.error(err);
            this.errorResponse = err;
            this.utilsService.showErrorMessage("Data Submission failed!");
            this.requestHeader = this.externalApiSubmissionService.requestHeader();
          }
        })
      }
      else {
        this.isFhirBundleMissing = true;
      }
    }
  }

  onClearFormData() {
    this.submitToApiForm.reset();
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

    (this.submitToApiForm.get('parameters') as FormArray).push(parameterGroup);
  }

  // Remove a parameter at specified index
  removeParameter(index: number): void {
    (this.submitToApiForm.get('parameters') as FormArray).removeAt(index);
  }


  private initForm(): void {
    this.submitToApiForm = this.fb.group({
      externalApiUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      parameters: this.fb.array([])
    });
    this.addParameter();
  }


  get parameterControls(): FormGroup[] {
    return (this.submitToApiForm.get('parameters') as FormArray).controls as FormGroup[];
  }

}
