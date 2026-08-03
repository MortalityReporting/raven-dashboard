import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable} from 'rxjs';
import {FhirResource} from "../../fhir-util";
import {ConfigService} from "../../../config/config.service";
import {SharedHttpErrorService} from "../../../service/shared-http-error.service";

@Injectable({
  providedIn: 'root'
})
export class FhirExplorerService {

  private fhirResource = new BehaviorSubject<FhirResource>(undefined);
  fhirResource$ = this.fhirResource.asObservable();

  apiUrl: string;
  private sharedHttpErrorService = inject(SharedHttpErrorService);

  constructor(private configService: ConfigService, private http:HttpClient) {
    this.apiUrl =`${this.configService.getApiUrl('fhirValidatorUrl')}$translate`
  }

  setSelectedFhirResource(fhirResource: any) {
    this.fhirResource.next(fhirResource);
  }

  translateToXml( resource: any ): Observable<any> {
    const body = {"resourceType": "Parameters", "parameter": [
      {
        "name": "resource",
        "resource": resource
      }
    ]};

    const options  = {
      responseType: 'text' as 'text',
    };

    return this.http.post(this.apiUrl, body, options ).pipe(
      catchError(error => this.sharedHttpErrorService.handleError(error))
    );
  }
}
