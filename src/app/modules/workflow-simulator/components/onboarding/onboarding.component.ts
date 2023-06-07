import {Component, OnInit, ViewChild} from '@angular/core';
import {LoggerService} from "../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {LogLine} from "../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {FormControl, FormGroup, NgForm, UntypedFormArray, UntypedFormBuilder, UntypedFormControl} from "@angular/forms";
import {BasicNameValueType} from "../../../../model/basic-name-value-type";

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
    endpointUrl: new FormControl(''),
    customizeHeaders: new FormControl(false),
  });

  selectedConnectionType: BasicNameValueType;
  componentName = this.constructor.name;
  connectionTypes: BasicNameValueType[] = [{value: "basicAuth" ,name: 'Basic Auth'}, {value: "token", name:'Token'}];
  constructor(
    private fb: UntypedFormBuilder,
    private log: LoggerService,
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
  onDeleteHeaderParam(index){
    this.headerParams.removeAt(index);
  }

  addHeaderParam() {
    const headerParamsFG = this.fb.group({
      key: new UntypedFormControl(''),
      value: new UntypedFormControl(''),
    });
    this.headerParams.push(headerParamsFG);
    this.onboardingForm.addControl('headerParameters', headerParamsFG);
  }

  onTestConnection() {
    this.form.ngSubmit.emit();
  }
}
