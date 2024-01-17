import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {ConfigService} from "../../../service/config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardApiInterfaceService {

  dashboardApiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.dashboardApiUrl = this.config.getDashboardApiUrl()
  }

  // GET /config
  // Special endpoint, see Config Service

  // GET /admin-panel
  getAdminPanelData(): Observable<any> {
    return this.http.get(`${this.dashboardApiUrl}admin-panel`);
  }

  // POST /document
  uploadFile(file: File, event: string): Observable<HttpEvent<any>> {
    const data = new FormData();
    console.log(file);
    console.log(event);
    data.append('file', file, file.name);
    data.append('event', event.toLowerCase());
    //let httpHeaders: HttpHeaders = new HttpHeaders().set('Content-Type', 'multipart/form-data; boundary=');
    //let httpOptions = {headers: httpHeaders}
    const request = new HttpRequest('POST', `${this.dashboardApiUrl}document`, data)
    return this.http.request(request);
  }

  // GET /document
  getDocument(bucketName: string, fileName: string) {
    return this.http.get(`${this.dashboardApiUrl}document`, {
      params: {
        bucket: bucketName,
        fileName: fileName
      }
    })
  }

}
