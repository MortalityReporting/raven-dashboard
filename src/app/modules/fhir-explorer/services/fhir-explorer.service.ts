import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {FhirResource} from "../../fhir-util";
import {ConfigService} from "../../../service/config.service";
import {Config} from "../../../model/config";

@Injectable({
  providedIn: 'root'
})
export class FhirExplorerService {
  config: Config;

  private fhirResource = new BehaviorSubject<FhirResource>(undefined);
  fhirResource$ = this.fhirResource.asObservable();

  apiUrl: string;

  constructor(private configService: ConfigService, private http:HttpClient) {
    this.config = configService.config;
    this.apiUrl =`${this.config.fhirValidatorUrl}/$translate`
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
