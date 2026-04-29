import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {EnvironmentHandlerService} from "../../../config/environment-handler.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardApiInterfaceService {

  private environmentHandler = inject(EnvironmentHandlerService);
  private http = inject(HttpClient);

  // GET /admin-panel
  getAdminPanelData(): Observable<any> {
    return this.http.get(`${this.environmentHandler.getApiUrl('dashboardApiUrl')}admin-panel`);
  }

  // POST /document
  uploadFile(file: File, event: string): Observable<HttpEvent<any>> {
    const data = new FormData();
    data.append('file', file, file.name);
    data.append('event', event.toLowerCase());
    const request = new HttpRequest('POST', `${this.environmentHandler.getApiUrl('dashboardApiUrl')}attachment/upload`, data)
    return this.http.request(request);
  }

  // GET /document
  getDocument(bucketName: string, fileName: string): Observable<any> {
    const data = new FormData()
    data.append('bucket', bucketName);
    data.append('filename', fileName);
    return this.http.post(`${this.environmentHandler.getApiUrl('dashboardApiUrl')}attachment/download`, data, {responseType: "blob"});
  }

}
