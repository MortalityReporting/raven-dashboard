import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable()
export class FhirAuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(environment.ravenFhirServer)) {
      let basicAuthCredentials = environment.ravenFhirServerBasicAuth; // Format presumes user:pass
      let basicAuthHeader = 'Basic ' + btoa(basicAuthCredentials);
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': basicAuthHeader
        }
      });
    }
    return next.handle(request);
  }
}
