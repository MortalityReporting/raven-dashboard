import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ImportCaseService {

  // API url
  importFileUrl = environment.ravenImportApi;

  constructor(private http:HttpClient) { }

  uploadFile(file): Observable<any> {

    const formData = new FormData();

    formData.append("file", file, file.name);

    return this.http.post(this.importFileUrl, formData)
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
    return this.http.post(this.importFileUrl,  content, {headers: headers}).pipe(map((result: any) => (
      result as Object
    )));
  }

  getMockResponse(): Observable<any> {
    return this.http.get('../../assets/data/export_to_excel_response.json')
  }

  importResource(fhirResource): Observable<any> {
    return this.http.post( environment.ravenFhirServer, fhirResource).pipe(map((result: any) => (
      result as Object
    )));
  }
}
