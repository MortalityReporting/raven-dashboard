import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest, HttpResponse} from "@angular/common/http";
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
  uploadFile(file: File, userId: string, registrationId: string): Observable<HttpEvent<any>> {
    const data = new FormData();
    data.append('file', file);
    data.append('userId', userId);
    data.append('registrationId', registrationId)
    const request = new HttpRequest('POST', `${this.dashboardApiUrl}document`, data,
      {reportProgress: true, responseType: 'json'}
    )
    return this.http.request(request);
  }

  // GET /document
  getDocument(fileName: string) {
    return this.http.get(`${this.dashboardApiUrl}document`, {
      params: {
        file_name: fileName
      }
    })
  }

}