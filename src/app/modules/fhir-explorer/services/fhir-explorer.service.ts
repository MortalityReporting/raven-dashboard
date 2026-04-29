import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FhirResource} from "../../fhir-util";
import {EnvironmentHandlerService} from "../../../config/environment-handler.service";

@Injectable({
  providedIn: 'root'
})
export class FhirExplorerService {

  private fhirResource = new BehaviorSubject<FhirResource>(undefined);
  fhirResource$ = this.fhirResource.asObservable();

  apiUrl: string;

  constructor(private environmentHandler: EnvironmentHandlerService, private http:HttpClient) {
    this.apiUrl =`${this.environmentHandler.getApiUrl('fhirValidatorUrl')}$translate`
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

    return this.http.post(this.apiUrl, body, options );
  }
}
