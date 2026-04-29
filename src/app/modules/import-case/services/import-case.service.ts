import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from "../../../config/config";
import {ConfigService} from "../../../config/config.service";


@Injectable({
  providedIn: 'root'
})
export class ImportCaseService {

  config: Config;
  constructor(
    private http:HttpClient,
    private configService: ConfigService
  ) {
    this.config = this.configService.config;
  }

  uploadFile(file, apiImportParameter: string): Observable<any> {

    const fileExtension = file.name.substring(file.name.length, (file.name.lastIndexOf('.')) + 1);
    let uriFileTypeSubstring = `upload-${fileExtension}-file`;
    let params = new HttpParams()
      .set('type', apiImportParameter)

    const formData = new FormData();

    formData.append("file", file, file.name);

    return this.http.post(this.config.ravenImportApiUrl + uriFileTypeSubstring, formData, { params:params })
  }

  importResource(fhirResource): Observable<any> {
    return this.http.post(this.config.ravenFhirServer.baseUrl, fhirResource)
  }
}
