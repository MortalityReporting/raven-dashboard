import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {ConfigService} from "./config.service";
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

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const data = new FormData();
    data.append('file', file);
    const request = new HttpRequest('POST', `${this.dashboardApiUrl}upload`, data,
      {reportProgress: true, responseType: 'json'}
    )
    return this.http.request(request);
  }

}
