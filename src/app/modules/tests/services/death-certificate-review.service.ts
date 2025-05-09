import {Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "../../../service/config.service";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeathCertificateReviewService {

  private _fhirBundle = signal<any>(null);
  public readonly fhirBundle = this._fhirBundle.asReadonly();
  public setFhirBundle(bundle: any) {
    this._fhirBundle.set(bundle);
  }

  dcrFhirBundleUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.dcrFhirBundleUrl = `${this.configService.config.ravenFhirServerBaseUrl}$ccr-funeralhome`;
  }

  generateDcrFhirBundle(data): Observable<any> {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/fhir+json');
    let authStringSplit = this.configService.config.ravenFhirServerBasicAuth.split(":");
    const basicAuthString = 'Basic ' + btoa(`${authStringSplit[0]}:${authStringSplit[1]}`);
    httpHeaders = httpHeaders.set('Authorization', basicAuthString);

    const  httpOptions = {headers: httpHeaders}
    const resource =  { resourceType: "Parameters", parameter: data };
    return this.http.post(`${this.dcrFhirBundleUrl}`, resource, httpOptions).pipe(
      tap((res: any) => {
        console.log(res)
        this.setFhirBundle(res)
      })
    );
  }

  submitToExternalApi(formData: any, fhirBundle: any): Observable<any> {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/fhir+json');
    const basicAuthString = 'Basic ' + btoa(`${formData.username}:${formData.password}`);

    const transformedParameters = formData.parameters
      .filter((param: {paramKey: string, paramValue: string}) => param.paramKey?.trim())
      .map((param: {paramKey: string, paramValue: string}) => ({
        key: param.paramKey,
        value: param.paramValue
      }));

    const headerObject: Record<string, string> = {};
    httpHeaders.keys().forEach(key => {
      headerObject[key] = httpHeaders.get(key) || '';
    });

    httpHeaders = httpHeaders.append('Authorization', basicAuthString);
    if(transformedParameters.length > 0) {
      transformedParameters.forEach(param => {
        httpHeaders = httpHeaders.append(param.key, param.value);
      })
    }

    const  httpOptions = {headers: httpHeaders}

    return this.http.post(`${formData.externalApiUrl}`, fhirBundle, httpOptions);
  }


}
