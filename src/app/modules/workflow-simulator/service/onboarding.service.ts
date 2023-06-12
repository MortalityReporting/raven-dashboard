import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {RequestType} from "../components/onboarding/onboarding.component";

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

  onLogin(request: any): Observable<any> {
    request = {
      type: RequestType.GET,
      username: "plamen",
      password: "testPassword",
      connection: 'basicAuth',
    }

    if(request?.type === RequestType.GET && request.connection === 'basicAuth'){
      const auth = (request.username + ":" +request.password);
      let authorizationData: string = 'Basic ' + btoa(auth);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': authorizationData
        })
      };

      console.log(httpOptions);

      return this.http.get("http://httpbin.org/basic-auth/foo/bar", httpOptions)
        .pipe(map(response => {
            return response;
          }),
        )
      // return this.http.get("http://127.0.0.1:8000/api/users/me", httpOptions)
      //   .pipe(map(response => {
      //       return response;
      //     }),
      //   )
    }
    else {
      return throwError("Invalid Request");
    }
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
  };
}
