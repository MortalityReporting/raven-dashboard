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
    const searchEdrCredentials = config?.workflowSimulator?.searchEdrOAuthCredentials;

    if (!searchEdrCredentials) {
      console.error('Search EDR OAuth credentials not configured');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      client_id: searchEdrCredentials.clientId,
      client_secret: searchEdrCredentials.clientSecret,
      audience: searchEdrCredentials.audience,
      grant_type: searchEdrCredentials.grantType,
    };

    return this.http.post(searchEdrCredentials.accessTokenUrl, body, { headers })
      .pipe(
        map(response => response?.['access_token']),
        tap(value => this.accessToken.next(value)),
    )
  }
}
