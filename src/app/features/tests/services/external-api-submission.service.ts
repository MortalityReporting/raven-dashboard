import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExternalApiSubmissionService {

  private _jsonRecord = signal<any>(null);
  public readonly jsonRecord = this._jsonRecord.asReadonly();
  public setJsonRecord(record: any) {
    this._jsonRecord.set(record);
  }

  private _requestHeader = signal<any>(null);
  public readonly requestHeader = this._requestHeader.asReadonly();
  public setRequestHeader(data: any) {
    this._requestHeader.set(data);
  }

  constructor(private http: HttpClient) {}

  submitToExternalApi(formData: any, fhirBundle: any): Observable<any> {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/fhir+json');
    const basicAuthString = 'Basic ' + btoa(`${formData.username}:${formData.password}`);

    const transformedParameters = formData.parameters
      .filter((param: {paramKey: string, paramValue: string}) => param.paramKey?.trim())
      .map((param: {paramKey: string, paramValue: string}) => ({
        key: param.paramKey,
        value: param.paramValue
      }));


    httpHeaders = httpHeaders.append('Authorization', basicAuthString);
    if(transformedParameters.length > 0) {
      transformedParameters.forEach(param => {
        httpHeaders = httpHeaders.append(param.key, param.value);
      })
    }
    const headerObject: Record<string, string> = {};
    httpHeaders.keys().forEach(key => {
      headerObject[key] = httpHeaders.get(key) || '';
    });

    const  httpOptions = {headers: httpHeaders}
    this.setRequestHeader(headerObject);

    return this.http.post(`${formData.externalApiUrl}`, fhirBundle, httpOptions)
  }
}
