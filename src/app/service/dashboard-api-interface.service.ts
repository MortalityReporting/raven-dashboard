import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

}
