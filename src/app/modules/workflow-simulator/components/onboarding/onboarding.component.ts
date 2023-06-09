import {Component, OnInit, ViewChild} from '@angular/core';
import {LoggerService} from "../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {LogLine} from "../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {FormControl, FormGroup, NgForm, UntypedFormArray, UntypedFormBuilder, UntypedFormControl} from "@angular/forms";
import {BasicNameValueType} from "../../../../model/basic-name-value-type";
import {OnboardingService} from "../../service/onboarding.service";

export enum RequestType {
  "GET"= "GET",
  "PUT" = "PUT",
  "POST" = "POST"
}
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  loggerData: LogLine[];

  @ViewChild('form') form: NgForm;

  onboardingForm: FormGroup = new FormGroup({
    connectionType: new FormControl(''),
    requestType: new FormControl(''),
    endpointUrl: new FormControl(''),
    customizeHeaders: new FormControl(false),
    addQueryParams: new FormControl(false),
    addRequestBody: new FormControl(false),
  });

  selectedConnectionType: BasicNameValueType;
  componentName = this.constructor.name;
  requestTypes: RequestType[] = [RequestType.GET, RequestType.PUT, RequestType.POST];
  connectionTypes: BasicNameValueType[] = [{value: "basicAuth" ,name: 'Basic Auth'}, {value: "token", name:'Token'}];

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
    this.log.logStream$.subscribe(value=> this.loggerData = value);
  }

  onConnectionTypeSelected() {
    if(this.selectedConnectionType.value === 'basicAuth'){
      this.onboardingForm.addControl('user', new FormControl(''));
      this.onboardingForm.addControl('password', new FormControl(''));
      this.onboardingForm.removeControl('token');
    }
    else {
      this.onboardingForm.removeControl('user');
      this.onboardingForm.removeControl('password');
      this.onboardingForm.addControl('token', new FormControl(''));
    }
    console.log(this.onboardingForm);
  }

  protected readonly undefined = undefined;


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

    this.onboardingService.onLogin().subscribe({
      next: value => console.log(value),
      error: err => {
        console.error(err);
        this.log.error(JSON.stringify(err), this.componentName)
      }
    });
  }

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
      this.onboardingForm.removeControl('queryParameters')
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
