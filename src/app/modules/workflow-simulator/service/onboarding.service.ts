import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {OnboardingHttpRequest} from "../model/onboarding-http-request";
import {RequestType} from "../components/onboarding/http-connection/http-connection.component";

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  firebaseUrl = "https://ng-auth-50216-default-rtdb.firebaseio.com/";
  authRestApi = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDELBqABNIo3AxFgot22haFfC6CP-iIr20";
  constructor( private http:HttpClient) { }

  onPostData(postData: any): Observable<any>{return this.http.post(this.firebaseUrl + 'posts.json', postData)};

  onGetData(): Observable<any> {
    return this.http.get(this.firebaseUrl + 'posts.json', {observe: 'response'})
      .pipe(map(response => {
          const postArray = [];
          for (const key in response.body) {
            if (response.body.hasOwnProperty(key)) {
              postArray.push({...response.body[key], id: key});
            }
          }
          return postArray;
        }),
        catchError(error => {
          //log to console
          return throwError(error);
        })
      )
  };

  onLogin(request: OnboardingHttpRequest): Observable<any> {
    // request = {
    //   url: "https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/Patient",
    //   requestType: RequestType.GET,
    //   username: "client",
    //   password: "secret",
    //   connectionType: 'basicAuth',
    // }

    //handle basic auth requests
    // if(request.connectionType === 'basicAuth') {
      //const auth = (request.user + ":" + request.password);
      const auth = ("client:secret");
      let authorizationData: string = 'Basic ' + btoa(auth);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': authorizationData
        })
      };

    const credentials = btoa("client:secret");

    return this.http.get("https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/Patient", httpOptions)
    // return this.http.get("https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/Patient", {
    //   headers: new HttpHeaders({Authorization: authorizationData})})

    // return this.http.get("https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/Patient", {
    //   headers: new HttpHeaders({Authorization: `Basic ${credentials}`})})
      // }
      // if (request.requestType == RequestType.GET) {
      //   return this.http.get(request.url, httpOptions)
      //     .pipe(map(response => {
      //         return response;
      //       }),
      //     )
      //
      // } else if (request.requestType == RequestType.PUT) {
      //   return this.http.get(request.url, httpOptions)
      //     .pipe(map(response => {
      //         return response;
      //       }),
      //     )
      // } else if (request.requestType == RequestType.POST) {
      //   return this.http.get(request.url, httpOptions)
      //     .pipe(map(response => {
      //         return response;
      //       }),
      //     )
      // }
      // else {
      //   return throwError("Invalid Request");
      // }
      // const requestBody = {
      //   email: 'ptassev3@gatech.edu',
      //   password: "Start111",
      //   returnSecureToken: true
      // };
      //
      //
      //
      // return this.http.post(this.authRestApi, requestBody)
      //   .pipe(map(response => {
      //       return response;
      //     }),
      //   )
      // }
      // else {
      //   return throwError("Invalid Request");

    }
}