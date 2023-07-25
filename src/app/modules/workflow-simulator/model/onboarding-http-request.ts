import {BasicNameValueType} from "../../../model/basic-name-value-type";
import {ConnectionType, RequestType} from "../components/tests/onboarding/http-connection/http-connection.component";
import {HttpHeaders, HttpParams} from "@angular/common/http";

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
  body?: any;
  requestParams?: any;
  queryParams?: any;
  headerParams?: any;
  httpOptions: any

  //Basic Auth Constructor
  constructor(formValue: FormValue){
    if (formValue.requestType == RequestType.GET && formValue.connectionType.value == ConnectionType.basicAuth) {
      const auth = (`${formValue.user}:${formValue.password}`);
      const authorizationData: string = 'Basic ' + btoa(auth);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authorizationData
      });

      const queryParams = new HttpParams(formValue.queryParams)
      this.httpOptions = {params: queryParams, headers}
        this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': authorizationData
        }),

      }
      // TODO add code for additional header params if needed
    }
    this.url = formValue.endpointUrl;
    this.requestType = formValue.requestType;
    this.connectionType = formValue.connectionType.value;
    this.headerParams = formValue.headerParams ?? null;
  }
}
