import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ImportCaseService {

  // API url
  baseApiUrl = "https://some.url"

  constructor(private http:HttpClient) { }

  uploadFile(file): Observable<any> {

    const formData = new FormData();

    formData.append("file", file, file.name);

    return this.http.post(this.baseApiUrl, formData)
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
    return this.http.post(this.baseApiUrl,  content, {headers: headers}).pipe(map((result: any) => (
      result as Object
    )));
  }
}
