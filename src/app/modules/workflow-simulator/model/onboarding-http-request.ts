import {RequestType} from "../components/onboarding/onboarding.component";
import {BasicNameValueType} from "../../../model/basic-name-value-type";

interface FormValue {
  endpointUrl: string;
  requestType: RequestType;
  connectionType: BasicNameValueType;
  user?: string;
  password?: string;
  requestBody?: any;
  requestParams?: any;
  queryParams?: any;
  headerParams?: any;
}

export class OnboardingHttpRequest {
  url: string;
  requestType: RequestType;
  connectionType: string;
  user?: string;
  password?: string;
  requestBody?: any;
  requestParams?: any;
  queryParams?: any;
  headerParams?: any;

  //Basic Auth Constructor
  constructor(formValue: FormValue){
    this.url = formValue.endpointUrl;
    this.requestType = formValue.requestType;
    this.connectionType = formValue.connectionType.value;
    this.user = formValue.user;
    this.password = formValue.password;
    this.headerParams = formValue.headerParams ?? null;
  }
}
