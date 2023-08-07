import {BasicNameValueType} from "../../../model/basic-name-value-type";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {RequestType} from "./request-type";
import {ConnectionType} from "./connection-type";

interface FormValue {
  endpointUrl: string;
  requestType: RequestType;
  connectionType: BasicNameValueType;
  user?: string;
  password?: string;
  requestBody?: any;
  requestParams?: any;
  queryParameters?: any;
  headerParameters?: any;
  token?: any;
}

export class OnboardingHttpRequest {
  url: string;
  requestType: RequestType;
  connectionType: string;
  requestBody?: any;
  httpOptions: any;

  constructor(formValue: FormValue){

    let queryParams = new HttpParams();
    formValue.queryParameters?.forEach(
      // HttpParams.append returns a clone of the params with the value appended, it does not update the params object
      param => queryParams = queryParams.append(param.key, param.value)
    )

    let headers = new HttpHeaders();
    if(formValue.headerParameters){
      formValue.headerParameters?.forEach(
        // HttpHeaders.append returns a clone of the headers with the value appended, it does not update the headers object
        param => headers = headers.append(param.key, param.value)
      )
    }

    this.url = formValue.endpointUrl;
    this.requestType = formValue.requestType;
    this.connectionType = formValue.connectionType.value;
    this.requestBody = formValue.requestBody;

    if (formValue.connectionType.value == ConnectionType.basicAuth) {
      /**
       * The Basic Auth can only handle encoded username and password and
       * any query params passed by the user.
       * If the user wishes to modify the request body, this is handled in the common section
       */
      const auth = (`${formValue.user}:${formValue.password}`);
      const authorizationData: string = 'Basic ' + btoa(auth);

      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', authorizationData);
    }
    else if (formValue.connectionType.value == ConnectionType.token){
      /**
       * The token (Bearer) Auth can only handle a token
       * any query params passed by the user.
       * If the user wishes to modify the request body, this is handled in the common section
       */
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', `Bearer ${formValue.token}`);
    }

    this.httpOptions = { params: queryParams, headers, observe: 'response' };

  }
}
