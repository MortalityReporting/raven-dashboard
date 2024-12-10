import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {map} from "rxjs/operators";
import {UiStringConstants} from "../../../providers/ui-string-constants";

@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {

  constructor(
    private http: HttpClient,
    private uiStringConstants: UiStringConstants) { }

  private accessToken = new Subject<string>();
  accessToken$ = this.accessToken.asObservable();

  setAccessTokenValue(value: string | null){
    this.accessToken.next(value)
  }


  getAccessToken(): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = {
         client_id: this.uiStringConstants.blueJayAuth0Credentials.clientId.value,
         client_secret: this.uiStringConstants.blueJayAuth0Credentials.clientSecret.value,
         audience: this.uiStringConstants.blueJayAuth0Credentials.audience.value,
         grant_type: this.uiStringConstants.blueJayAuth0Credentials.grantType.value,
     };

    return this.http.post(this.uiStringConstants.blueJayAuth0Credentials.accessTokenUrl.value, body, { headers })
      .pipe(
        map(response => response?.['access_token']),
        tap(value => this.accessToken.next(value)),
    )
  }
}
