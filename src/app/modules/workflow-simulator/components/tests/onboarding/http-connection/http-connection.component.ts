import {Component, OnInit, ViewChild} from '@angular/core';
import {LoggerService} from "../../../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {
  FormControl,
  FormGroup,
  NgForm,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from "@angular/forms";
import {BasicNameValueType} from "../../../../../../model/basic-name-value-type";
import {OnboardingService} from "../../../../service/onboarding.service";
import {OnboardingHttpRequest} from "../../../../model/onboarding-http-request";
import {RequestType} from "../../../../model/request-type";
import { RequestTypeOptions, ConnectionTypeOptions} from "../../../../providers/module-constants";
import {ConnectionType} from "../../../../model/connection-type";

@Component({
  selector: 'app-http-connection',
  templateUrl: './http-connection.component.html',
  styleUrls: ['./http-connection.component.scss']
})
export class HttpConnectionComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  protected readonly ConnectionTypeOptionsArray = Object.values(ConnectionTypeOptions);
  protected readonly RequestTypeOptions = RequestTypeOptions;
  protected readonly RequestType = RequestType;

  onboardingForm: FormGroup = new FormGroup({
    connectionType: new FormControl('', Validators.required),
    requestType: new FormControl('', Validators.required),
    endpointUrl: new FormControl('', Validators.required),
  });

  selectedConnectionType: BasicNameValueType;
  componentName = this.constructor.name;
  loginSuccessResponse: any;
  loginErrorResponse: any;
  isAdvancedSettingsVisible: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private log: LoggerService,
    protected onboardingService: OnboardingService
  ) {
  }

  /**
   * Initialize the form int it's most for basic auth which is the simples from of authentication.
   * We may consider changing the initial form to JWT or custom, based on user feedback.
   */
  initOnboardingForm(){
    this.isAdvancedSettingsVisible = false;
    this.onboardingForm.controls['requestType'].patchValue(RequestType.GET);
    this.onboardingForm.controls['connectionType'].patchValue(ConnectionTypeOptions[ConnectionType.basicAuth]);
    this.onboardingForm.addControl('user', new FormControl('', Validators.required));
    this.onboardingForm.addControl('password', new FormControl('', Validators.required));
  }

  onShowHideAdvancedSettings(advancedSettingsVisible: boolean) {
    this.isAdvancedSettingsVisible = advancedSettingsVisible;
    if(advancedSettingsVisible){
      this.onboardingForm.addControl('customizeHeaders', new FormControl(false));
      this.onboardingForm.addControl('addQueryParams', new FormControl(false));
      this.onboardingForm.addControl('addRequestBody', new FormControl(false));
    }
    else {
      this.onboardingForm.removeControl("customizeHeaders");
      this.onboardingForm.removeControl("addQueryParams");
      this.onboardingForm.removeControl('queryParameters');
      if(this.onboardingForm.controls['requestType'].value != RequestType.GET){
        this.onboardingForm.removeControl('addRequestBody');
      }
    }
  }

  ngOnInit(): void {
    this.initOnboardingForm();
  }

  /**
   * The user can select from a multiple connection types such as basic auth aor jwt.
   * This function manipulates the form because each connection type requires different form fields.
   */
  onConnectionTypeSelected() {
    if(this.selectedConnectionType.value == ConnectionType.basicAuth){
      this.onboardingForm.addControl('user', new FormControl('', Validators.required));
      this.onboardingForm.addControl('password', new FormControl('', Validators.required));
      this.onboardingForm.removeControl('token');

      if(this.onboardingForm.controls['addQueryParams'].value){
        this.onboardingForm.removeControl("queryParameters");
        this.onboardingForm.controls['addQueryParams'].patchValue(false);
      }

      if(this.onboardingForm.controls['addRequestBody'].value){
        this.onboardingForm.removeControl("requestBody");
        this.onboardingForm.controls['addRequestBody'].patchValue(false);
      }
    }
    else if(this.selectedConnectionType.value == ConnectionType.token){
      this.onboardingForm.addControl('addRequestBody', new FormControl(false));
      this.onboardingForm.removeControl('user');
      this.onboardingForm.removeControl('password');
      if(!this.onboardingForm.controls['token']){
        this.onboardingForm.addControl('token', new FormControl('', Validators.required));
      }

    }
    else {
      this.onboardingForm.removeControl('user');
      this.onboardingForm.removeControl('password');
      this.onboardingForm.addControl('token', new FormControl(''));
      this.onboardingForm.addControl('addRequestBody', false);
    }
  }

  /**
   * The user can select from a GET, PUT, and POST request (for now those are the only options we allow).
   * This function manipulates the form because each request type requires different form fields.
   */
  onRequestTypeSelected() {
    if(this.onboardingForm.value.requestType === RequestType.GET){
      this.onboardingForm.removeControl('requestBody');
    }
    else if(this.onboardingForm.value.requestType == RequestType.PUT){
      this.onboardingForm.addControl('addRequestBody', new FormControl(false));
    }
    else if(this.onboardingForm.value.requestType == RequestType.POST){
      this.onboardingForm.addControl('addRequestBody', new FormControl(false));
    }
  }

  /**
   * Basic form validator
   * @param formGroup
   * @private
   */
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  };

  /**
   * Calls the API to execute login.
   * @param request
   */
  login(request: OnboardingHttpRequest){
    this.loginSuccessResponse = null;
    this.loginErrorResponse = null;
    this.onboardingService.onLogin(request).subscribe({
      next: value => {
        console.log(value);
        this.log.info("Successful login to " + request.url, this.componentName);
        this.loginSuccessResponse = value;

      },
      error: err => {
        console.error(err);
        this.loginErrorResponse = err;
        this.log.error(JSON.stringify(err), this.componentName);
      }
    });

  }

  onSubmit() {
    this.validateAllFormFields(this.onboardingForm);
    if (!this.onboardingForm.valid) {
      console.error("Invalid Connection Registration Form.")
      return;
    }
    const request: OnboardingHttpRequest = new OnboardingHttpRequest(this.onboardingForm.value);
    this.login(request);
  }

  get queryParams() {
    return this.onboardingForm.controls["queryParameters"] as UntypedFormArray;
  }

  get headerParams() {
    return this.onboardingForm.controls["headerParameters"] as UntypedFormArray;
  }

  onDeleteQueryParam(index: number) {
    this.queryParams.removeAt(index);
  }

  addHeaderParam() {
    const headerParamsFG = this.fb.group({
      key: new UntypedFormControl(''),
      value: new UntypedFormControl(''),
    });
    this.headerParams.push(headerParamsFG);
    this.onboardingForm.addControl('headerParameters', headerParamsFG);
  }

  addQueryParam() {
    const queryParamsFG = this.fb.group({
      key: new UntypedFormControl(''),
      value: new UntypedFormControl(''),
    });
    this.queryParams.push(queryParamsFG);
    this.onboardingForm.addControl('queryParameters', queryParamsFG);
  }

  onCustomizeHeadersSelectionChange() {
    if(this.onboardingForm.controls['customizeHeaders'].value){
      this.onboardingForm.addControl('headerParameters', this.fb.array([]));
      this.addHeaderParam();
    }
    else {
      this.onboardingForm.removeControl('headerParameters')
    }
  }

  onAddQueryParamsSelectionChange() {
    if(this.onboardingForm.controls['addQueryParams'].value){
      this.onboardingForm.addControl('queryParameters', this.fb.array([]));
      this.addQueryParam();
    }
    else {
      this.onboardingForm.removeControl('queryParameters');
    }
  }
  onAddRequestBody() {
    if(this.onboardingForm.value.addRequestBody) {
      this.onboardingForm.addControl('requestBody', new FormControl(''));
    }
    else {
      this.onboardingForm.removeControl('requestBody')
    }
  }

  onDeleteHeaderParam(index){
    this.headerParams.removeAt(index);
    if(index == 0 ){ // all header params have been remover, and we need to deselect the Customize Headers checkbox
      this.onboardingForm.controls['customizeHeaders'].patchValue(false);
    }
  }

  /**
   * Trigger the form submission with a submit button places outside the html scope of the form
   * (outside the <form></form> tags).
   */
  onTestConnection() {
    this.form.ngSubmit.emit();
  }

}
