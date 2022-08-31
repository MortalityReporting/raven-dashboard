import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FhirExplorerService {

  apiUrl = "https://apps.hdap.gatech.edu/HL7ValidatorService/fhir/$translate"

  constructor(private http:HttpClient) { }

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
