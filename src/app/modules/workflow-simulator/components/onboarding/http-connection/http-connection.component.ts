import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoggerService} from "../../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {
  FormControl,
  FormGroup,
  NgForm,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from "@angular/forms";
import {BasicNameValueType} from "../../../../../model/basic-name-value-type";
import {OnboardingService} from "../../../service/onboarding.service";
import {OnboardingHttpRequest} from "../../../model/onboarding-http-request";

export enum RequestType {
  "GET"= "GET",
  "PUT" = "PUT",
  "POST" = "POST"
}
@Component({
  selector: 'app-http-connection',
  templateUrl: './http-connection.component.html',
  styleUrls: ['./http-connection.component.css']
})
export class HttpConnectionComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  @Output() removeConnection: EventEmitter<void> = new EventEmitter<void>();
  @Input() showRemoveBtn: boolean = true;

  onboardingForm: FormGroup = new FormGroup({
    connectionType: new FormControl('', Validators.required),
    requestType: new FormControl('', Validators.required),
    endpointUrl: new FormControl('', Validators.required),
    customizeHeaders: new FormControl(false),
    addQueryParams: new FormControl(false),
    addRequestBody: new FormControl(false),
  });

  selectedConnectionType: BasicNameValueType;
  componentName = this.constructor.name;
  requestTypes: RequestType[] = [RequestType.GET, RequestType.PUT, RequestType.POST];
  connectionTypes: BasicNameValueType[] = [
    {value: "basicAuth" ,name: 'Basic Auth'},
    {value: "token", name:'Bearer Token'},
    {value: "custom", name:'Custom'}];

  constructor(
    private fb: UntypedFormBuilder,
    private log: LoggerService,
    private onboardingService: OnboardingService
  ) {
  }
  logMessage(level: string) {
    console.log(this.constructor.name)
    if(level === 'info'){
      this.log.info("I am an Info Message", this.componentName);
    }
    else if (level === 'warn') {
      this.log.warn("I am a Warning Message", this.componentName);
    }
    else if (level === 'error') {
      this.log.error("I am an Error Message", this.componentName);
    }
  }

  clearLog(){
    this.log.clear()
  }

  ngOnInit(): void {
    this.onboardingForm.controls['requestType'].patchValue(RequestType.GET);
    this.onboardingForm.controls['connectionType'].patchValue(this.connectionTypes[0]);
    this.onboardingForm.controls['addRequestBody'].disable();
    this.onboardingForm.controls['addQueryParams'].disable();
    this.onboardingForm.addControl('user', new FormControl('', Validators.required));
    this.onboardingForm.addControl('password', new FormControl('', Validators.required));
    console.log(this.onboardingForm);
  }

  onConnectionTypeSelected() {
    if(this.selectedConnectionType.value === 'basicAuth'){
      this.onboardingForm.addControl('user', new FormControl('', Validators.required));
      this.onboardingForm.addControl('password', new FormControl('', Validators.required));
      this.onboardingForm.removeControl('token');

      if(this.onboardingForm.controls['addQueryParams'].value){
        this.onboardingForm.removeControl("queryParameters");
        this.onboardingForm.controls['addQueryParams'].patchValue(false);
      }
      this.onboardingForm.controls['addQueryParams'].disable();

      if(this.onboardingForm.controls['addRequestBody'].value){
        this.onboardingForm.removeControl("requestBody");
        this.onboardingForm.controls['addRequestBody'].patchValue(false);
      }
      this.onboardingForm.controls['addRequestBody'].disable();

    }
    else {
      this.onboardingForm.removeControl('user');
      this.onboardingForm.removeControl('password');
      this.onboardingForm.addControl('token', new FormControl('', Validators.required));
      this.onboardingForm.controls['addQueryParams'].enable();
      this.onboardingForm.controls['addRequestBody'].enable();
    }
    console.log(this.onboardingForm);
  }

  protected readonly undefined = undefined;

  private validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  onSubmit() {
    console.log(this.onboardingForm);
    // this.onboardingService.onPostData({"name": "Test Name", "content": "Test Content"}).subscribe({
    //   next: value => console.log(value),
    //   error: err => console.error(err)
    // });

    // this.onboardingService.onGetData().subscribe({
    //   next: value => console.log(value),
    //   error: err => console.error(err)
    // });

    this.validateAllFormFields(this.onboardingForm);
    if (!this.onboardingForm.valid) {
      return;
    }
    console.log(this.onboardingForm.value);
    const request: OnboardingHttpRequest = new OnboardingHttpRequest(this.onboardingForm.value);
    this.onboardingService.onLogin(request).subscribe({
      next: value => {
        console.log(value);
        this.log.info("Successful login to " + request.url, this.componentName)
      },
      error: err => {
        console.error(err);
        this.log.error(JSON.stringify(err), this.componentName)
      }
    });

  }

    // this.onboardingService.onLogin("request").subscribe({
    //   next: value => console.log(value),
    //   error: err => {
    //     console.error(err);
    //     this.log.error(JSON.stringify(err), this.componentName)
    //   }
    // });
  // }

  get queryParams() {
    return this.onboardingForm.controls["queryParameters"] as UntypedFormArray;
  }

  get headerParams() {
    return this.onboardingForm.controls["headerParameters"] as UntypedFormArray;
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
  onDeleteHeaderParam(index){
    this.headerParams.removeAt(index);
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

  onTestConnection() {
    this.form.ngSubmit.emit();
  }

  onRequestTypeSelected() {
    if(this.onboardingForm.value.requestTypes === RequestType.GET){
      this.onboardingForm.controls['addRequestBody'].disable();
      this.onboardingForm.removeControl('requestBody');
    }
    else if(this.onboardingForm.value.connectionType != this.connectionTypes[0]){
      this.onboardingForm.controls['addRequestBody'].enable();
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
}
