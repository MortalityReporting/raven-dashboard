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
    const blueJayCredentials = config?.workflowSimulator?.blueJayAuth0Credentials;

    if (!blueJayCredentials) {
      console.error('BlueJay Auth0 credentials not configured');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      client_id: blueJayCredentials.clientId.value,
      client_secret: blueJayCredentials.clientSecret.value,
      audience: blueJayCredentials.audience.value,
      grant_type: blueJayCredentials.grantType.value,
    };

    return this.http.post(blueJayCredentials.accessTokenUrl.value, body, { headers })
      .pipe(
        map(response => response?.['access_token']),
        tap(value => this.accessToken.next(value)),
    )
  }
}
