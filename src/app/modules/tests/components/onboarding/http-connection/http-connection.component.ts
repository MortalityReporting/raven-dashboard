import {
  Component,
  Inject,
  input,
  OnInit,
  output,
  ViewChild,
  signal
} from '@angular/core';
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
import {OnboardingService} from "../../../services/onboarding.service";
import { RequestTypeOptions, ConnectionTypeOptions} from "../../../providers/module-constants";
import {ConnectionType} from "../../../models/connection-type";
import {RequestType} from "../../../models/request-type";
import {OnboardingHttpRequest} from "../../../models/onboarding-http-request";
import {UtilsService} from "../../../../../service/utils.service";
import {LoggerService} from "../../../../../components/widgets/console-logger/services/logger.service";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";


@Component({
    selector: 'app-http-connection',
    templateUrl: './http-connection.component.html',
    styleUrls: ['./http-connection.component.scss'],
    standalone: false
})
export class HttpConnectionComponent implements OnInit {

  stage = input.required<any>();
  formValueChangeEvent = output<any>();

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
  protected readonly loginSuccessResponse = signal<any>(null);
  protected readonly loginErrorResponse = signal<any>(null);
  isAdvancedSettingsVisible: boolean = false;


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

    // Set up form value change subscription
    this.onboardingForm.valueChanges
      .subscribe(formValue=>
        this.formValueChangeEvent.emit({formValue: formValue}));

    // Update the parent with the initial form values
    this.formValueChangeEvent.emit({formValue: this.onboardingForm.value});
  }

  onShowHideAdvancedSettings(advancedSettingsVisible: boolean) {
    this.isAdvancedSettingsVisible = advancedSettingsVisible;
    if(advancedSettingsVisible){
      this.onboardingForm.addControl('customizeHeaders', new FormControl(false));
      this.onboardingForm.addControl('addQueryParams', new FormControl(false));

    }
    else {
      this.onboardingForm.removeControl('headerParameters');
      this.onboardingForm.removeControl('queryParameters');
      this.onboardingForm.removeControl("customizeHeaders");
      this.onboardingForm.removeControl("addQueryParams");
      this.onboardingForm.removeControl('queryParameters');
      if(this.onboardingForm.controls['requestType'].value != RequestType.GET){
        this.onboardingForm.removeControl('addRequestBody');
        this.onboardingForm.removeControl('urlEncodedParams');
      }
    }
  }

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private fb: UntypedFormBuilder,
    private loggerService: LoggerService,
    public onboardingService: OnboardingService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    // Initialize the form with default values
    this.initOnboardingForm();

    // Check if we have initial data to load (for when component is first created with data)
    const stageData = this.stage();
    if (stageData?.formData) {
      this.fillFormFromJsonData(stageData.formData);
    }
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
    this.loginSuccessResponse.set(null);
    this.loginErrorResponse.set(null);
    this.onboardingService.onLogin(request).subscribe({
      next: value => {
        this.loggerService.info("Successful login to " + request.url, this.componentName);
        this.loginSuccessResponse.set(value);
      },
      error: err => {
        console.error(err);
        this.loginErrorResponse.set(err);
        this.loggerService.error(JSON.stringify(err), this.componentName);
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

  addHeaderParam(key?: string, value?: string) {
    const headerParamsFG = this.fb.group({
      key: new UntypedFormControl(key),
      value: new UntypedFormControl(value),
    });
    this.headerParams.push(headerParamsFG);
    this.onboardingForm.addControl('headerParameters', headerParamsFG);
  }

  addQueryParam(key?: string, value?: string) {
    const queryParamsFG = this.fb.group({
      key: new UntypedFormControl(key),
      value: new UntypedFormControl(value),
    });
    this.queryParams.push(queryParamsFG);
    this.onboardingForm.addControl('queryParameters', queryParamsFG);
  }

  addUrlEncodedParam(key?: string, value?: string) {
    const urlEncodedParamsFG = this.fb.group({
      key: new UntypedFormControl(key),
      value: new UntypedFormControl(value),
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

  /**
   * This is a best effort method designed to generate new from(s) with the network connection data, and fill those forms.
   * This way the user does not have to fill in the data for their network connection(s) every time they fill they try to
   * complete the onboarding test.
   *
   * @param jsonData - contains the connection form fields and form data.
   */
  fillFormFromJsonData(jsonData) {
    try {
      // Clear existing form controls except the base ones
      Object.keys(this.onboardingForm.controls).forEach(key => {
        if (!['connectionType', 'requestType', 'endpointUrl'].includes(key)) {
          this.onboardingForm.removeControl(key);
        }
      });

      // Update base controls
      this.onboardingForm.patchValue({
        connectionType: ConnectionTypeOptions[ConnectionType?.[jsonData?.connectionType?.value]],
        endpointUrl: jsonData.endpointUrl,
        requestType: jsonData.requestType
      });

      // Add authentication controls
      if ('user' in jsonData) {
        this.onboardingForm.addControl('user', new FormControl(jsonData.user, Validators.required));
      }

      if ('password' in jsonData) {
        this.onboardingForm.addControl('password', new FormControl(jsonData.password, Validators.required));
      }

      if ('token' in jsonData) {
        this.onboardingForm.addControl('token', new FormControl(jsonData.token));
      }

      // Add request body controls
      if ('requestBodyOptions' in jsonData) {
        this.onboardingForm.addControl('requestBodyOptions', new FormControl(jsonData.requestBodyOptions));
      }

      if ('requestBody' in jsonData) {
        this.onboardingForm.addControl('requestBody', new FormControl(jsonData.requestBody));
      }

      // Add advanced settings
      if ("customizeHeaders" in jsonData || "addQueryParams" in jsonData) {
        this.isAdvancedSettingsVisible = true;

        if ("customizeHeaders" in jsonData) {
          this.onboardingForm.addControl('customizeHeaders', new FormControl(jsonData.customizeHeaders));
        }

        if ("addQueryParams" in jsonData) {
          this.onboardingForm.addControl('addQueryParams', new FormControl(jsonData.addQueryParams));
        }

        if (jsonData.headerParameters) {
          this.onboardingForm.addControl('headerParameters', this.fb.array([]));
          jsonData.headerParameters.forEach(param => {
            this.addHeaderParam(param.key, param.value);
          });
        }

        if (jsonData.queryParameters) {
          this.onboardingForm.addControl('queryParameters', this.fb.array([]));
          jsonData.queryParameters.forEach(param => {
            this.addQueryParam(param.key, param.value);
          });
        }
      }

      if ("urlEncodedParameters" in jsonData) {
        this.onboardingForm.addControl('urlEncodedParameters', this.fb.array([]));
        jsonData.urlEncodedParameters.forEach(param => {
          this.addUrlEncodedParam(param.key, param.value);
        });
      }

      // Emit the updated form value
      this.formValueChangeEvent.emit({formValue: this.onboardingForm.value});
    }
    catch(e){
      console.error(e);
      this.utilsService.showErrorMessage("Error parsing form data.")
      this.loggerService.error("Error parsing form data.", this.componentName);
    }
  }

}
