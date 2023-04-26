import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {FhirResource} from "../../fhir-util/models/base/fhir.resource";

@Injectable({
  providedIn: 'root'
})
export class FhirExplorerService {

  private fhirResource = new Subject<FhirResource>();
  fhirResource$ = this.fhirResource.asObservable();

  apiUrl = "https://apps.hdap.gatech.edu/HL7ValidatorService/fhir/$translate"

  constructor(private http:HttpClient) {}

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
