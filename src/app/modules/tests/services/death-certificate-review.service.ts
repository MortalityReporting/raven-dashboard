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
      tap((res: any) => {this.setFhirBundle(res)})
    );
  }

  submitToExternalApi(formData: any, fhirBundle: any): Observable<any> {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/fhir+json');
    const basicAuthString = 'Basic ' + btoa(`${formData.username}:${formData.password}`);
    httpHeaders = httpHeaders.set('Authorization', basicAuthString);

    const  httpOptions = {headers: httpHeaders}

    return this.http.post(`${formData.externalApiUrl}`, fhirBundle, httpOptions).pipe(
      tap((res: any) => {
        this.setFhirBundle(res)
      })
    );
  }


}
