import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {
  FormControl,
  FormGroup, FormGroupDirective,
  NgForm,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from "@angular/forms";
import {BasicNameValueType} from "../../../../../model/basic-name-value-type";
import {OnboardingService} from "../../../services/onboarding.service";
import { RequestTypeOptions, ConnectionTypeOptions} from "../../../providers/module-constants";
import {ConnectionType} from "../../../models/connection-type";
import {RequestType} from "../../../models/request-type";
import {OnboardingHttpRequest} from "../../../models/onboarding-http-request";
import {UtilsService} from "../../../../../service/utils.service";
import {LoggerService} from "ngx-hisb-logger";


@Component({
  selector: 'app-http-connection',
  templateUrl: './http-connection.component.html',
  styleUrls: ['./http-connection.component.scss']
})
export class HttpConnectionComponent implements OnInit, OnChanges{

  @Input() stage: any;
  @Output() formValueChangeEvent = new EventEmitter<any>()

  @ViewChild('form') form: NgForm;
  readonly ConnectionTypeOptionsArray = Object.values(ConnectionTypeOptions);
  readonly RequestTypeOptions = RequestTypeOptions;
  readonly RequestType = RequestType;

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
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB

  constructor(
    private fb: UntypedFormBuilder,
    private log: LoggerService,
    public onboardingService: OnboardingService,
    private utilsService: UtilsService
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

    }
    else {
      this.onboardingForm.removeControl("customizeHeaders");
      this.onboardingForm.removeControl("addQueryParams");
      this.onboardingForm.removeControl('queryParameters');
      if(this.onboardingForm.controls['requestType'].value != RequestType.GET){
        this.onboardingForm.removeControl('addRequestBody');
        this.onboardingForm.removeControl('urlEncodedParams');
      }
    }
  }

  ngOnInit(): void {
    this.initOnboardingForm();
    this.onboardingForm.valueChanges
      .subscribe(formValue=>
        this.formValueChangeEvent.emit({formValue: formValue}));
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
    }
    else if(this.selectedConnectionType.value == ConnectionType.token){
      this.onboardingForm.removeControl('user');
      this.onboardingForm.removeControl('password');
      if(!this.onboardingForm.controls['token']){
        this.onboardingForm.addControl('token', new FormControl(''));
      }

    }
    else {
      this.onboardingForm.removeControl('user');
      this.onboardingForm.removeControl('password');
      this.onboardingForm.removeControl('token');
    }
  }

  /**
   * The user can select from a GET, PUT, and POST request (for now those are the only options we allow).
   * This function manipulates the form because each request type requires different form fields.
   */
  onRequestTypeSelected() {
    if(this.onboardingForm.value.requestType === RequestType.GET){
      this.onboardingForm.removeControl('requestBody');
      this.onboardingForm.removeControl('requestBodyOptions');
    }
    else if(
        this.onboardingForm.value.requestType == RequestType.PUT
        ||
        this.onboardingForm.value.requestType == RequestType.POST
    ){
      this.onboardingForm.addControl('requestBodyOptions', new FormControl('rawBody'));
      this.onboardingForm.addControl('requestBody', new FormControl(''));
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

  get urlEncodedParams() {
    return this.onboardingForm.controls["urlEncodedParameters"] as UntypedFormArray;
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

  addUrlEncodedParam() {
    const urlEncodedParamsFG = this.fb.group({
      key: new UntypedFormControl(''),
      value: new UntypedFormControl(''),
    });
    this.urlEncodedParams.push(urlEncodedParamsFG);
    this.onboardingForm.addControl('urlEncodedParameters', urlEncodedParamsFG);
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

  onDeleteHeaderParam(index: number){
    this.headerParams.removeAt(index);
  }

  onDeleteUrlEncodedParam(index: number) {
    this.urlEncodedParams.removeAt(index);
  }

  onDeleteQueryParam(index: number) {
    this.queryParams.removeAt(index);
  }

  /**
   * Trigger the form submission with a submit button places outside the html scope of the form
   * (outside the <form></form> tags).
   */
  onTestConnection() {
    this.form.ngSubmit.emit();
  }

  onRequestBodySelectionChange(selection: string) {

    if(selection == 'urlEncoded'){
      this.onboardingForm.addControl('urlEncodedParameters', this.fb.array([]));
      this.onboardingForm.removeControl('requestBody');
      this.addUrlEncodedParam();
    }
    else if (selection == 'rawBody'){
      this.onboardingForm.removeControl('urlEncodedParameters');
      this.onboardingForm.addControl('requestBody', new FormControl(''));
    }
  }

  onExportStage() {
    const filename = 'saved_connection.json';

    let formValue = this.onboardingForm.value;
    //For security reason we always want to remove the password (we should never save user passwords)
    if(formValue?.password){
      formValue.password = '';
    }

    const file = new Blob([JSON.stringify(formValue)], {type: "application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    link.remove();
  }

  onFileSelected(event: any) {
    this.utilsService.closeNotification();

    const file: File = event.target.files[0];

    if(!file){
      this.utilsService.showErrorMessage("Unable to open the file.");
    }
    else if (file.size > this.MAX_FILE_SIZE){
      console.error("File too big")
      this.utilsService.showErrorMessage("This file exceeds " + this.MAX_FILE_SIZE /  1000 + "kb and cannot be processed");
    }
    else {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");

      fileReader.onload = () => {
        this.fillFormFromJsonData(JSON.parse(fileReader.result as string))
      }
      fileReader.onerror = (error) => {
        this.utilsService.showSuccessMessage("Error reading the file.")
      }
    }

  }

  fillFormFromJsonData(jsonData) {
    this.initOnboardingForm();
    if(jsonData?.connectionType?.value === ConnectionType?.basicAuth){
      const requestType = this.RequestTypeOptions.find(requestType=> requestType == jsonData.requestType);
      console.log(requestType);
      console.log( this.onboardingForm);
      this.onboardingForm.controls['requestType'].patchValue(RequestType.POST);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }
}
