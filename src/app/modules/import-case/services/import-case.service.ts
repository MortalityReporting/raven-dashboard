import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
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

    const fileExtension = file.name.substring(file.name.length, (file.name.lastIndexOf('.')) + 1);
    let uriFileTypeSubstring = `upload-${fileExtension}-file`;
    let params = new HttpParams()
      .set('type', apiImportParameter)

    const formData = new FormData();

    formData.append("file", file, file.name);

    return this.http.post(this.environmentHandler.getFhirImportServerURL() + uriFileTypeSubstring, formData, { params:params })
  }

  importResource(fhirResource): Observable<any> {
    return this.http.post(this.environmentHandler.getFhirServerBaseURL(), fhirResource)
  }
}
