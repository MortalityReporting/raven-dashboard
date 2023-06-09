import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {map, catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  firebaseUrl = "https://ng-auth-50216-default-rtdb.firebaseio.com/";
  authRestApi = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDELBqABNIo3AxFgot22haFfC6CP-iIr20";
  constructor( private http:HttpClient) { }

  onPostData(postData: any): Observable<any>{return this.http.post(this.firebaseUrl + 'posts.json', postData)};

  onGetData(): Observable<any>{
    return this.http.get(this.firebaseUrl + 'posts.json', {observe: 'response'})
      .pipe(map(response => {
        console.log(response);
      const postArray = [];
      for(const key in response.body){
        if (response.body.hasOwnProperty(key)){
          postArray.push({...response.body[key], id: key});
        }
      }
      return postArray;
    }),
        catchError(error =>  {
          //log to console
          return throwError(error);
        })

      )
  };

  onLogin(): Observable<any>{
    const requestBody = {
      email: 'ptassev3@gatech.edu',
      password: "Start111",
      returnSecureToken: true
    };

    return this.http.post(this.authRestApi, requestBody)
      .pipe(map(response => {
          return response;
        }),
      )
  };
}
