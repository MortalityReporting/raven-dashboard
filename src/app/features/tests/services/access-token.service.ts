import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {map} from "rxjs/operators";
import {ConfigService} from "../../../config/config.service";

@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService) { }

  private accessToken = new Subject<string>();
  accessToken$ = this.accessToken.asObservable();

  setAccessTokenValue(value: string | null){
    this.accessToken.next(value)
  }


  getAccessToken(): Observable<string> {
    const config = this.configService.config();
    const searchEdrsCredentials = config?.workflowSimulator?.searchEdrsAuth0Credentials;

    if (!searchEdrsCredentials) {
      console.error('Search EDRS Auth0 credentials not configured');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      client_id: searchEdrsCredentials.clientId,
      client_secret: searchEdrsCredentials.clientSecret,
      audience: searchEdrsCredentials.audience,
      grant_type: searchEdrsCredentials.grantType,
    };

    return this.http.post(searchEdrsCredentials.accessTokenUrl, body, { headers })
      .pipe(
        map(response => response?.['access_token']),
        tap(value => this.accessToken.next(value)),
    )
  }
}
