import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {EnvironmentHandlerService} from "../../fhir-util";


@Injectable({
  providedIn: 'root'
})
export class ImportCaseService {

  constructor(
    private environmentHandler: EnvironmentHandlerService,
    private http:HttpClient
  ) { }

  uploadFile(file, apiImportParameter: string): Observable<any> {

    let params = new HttpParams()
      .set('type', apiImportParameter)

    const formData = new FormData();

    formData.append("file", file, file.name);

    return this.http.post(this.environmentHandler.getFhirImportServerURL(), formData, {params:params})
  }

  uploadFileContent(content, contentFormat): Observable<any>{

    let headers = null;

    if (contentFormat === 'json') {
      headers = new HttpHeaders()
        .set('Content-Type', 'application/fhir+json');
    }
    else if (contentFormat === 'xml'){
      headers = new HttpHeaders()
        .set('Content-Type', 'application/fhir+xml');
    }
    else {
      console.error("Only json and xml are acceptable file formats!")
    }

    let data = null;
    return this.http.post(this.environmentHandler.getFhirImportServerURL(),  content, {headers: headers});
  }

  getMockResponse(): Observable<any> {
    return this.http.get('../../assets/data/export_to_excel_response.json')
  }

  importResource(fhirResource): Observable<any> {
    return this.http.post(this.environmentHandler.getFhirServerBaseURL(), fhirResource).pipe(map((result: any) => (
      result as Object
    )));
  }
}
