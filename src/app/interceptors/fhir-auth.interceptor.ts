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

  // TODO: Fix so headers are added regardless of trailing slash.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Remove Trailing Slash if Exists.
    let cleanRavenFhirServerUrl = environment.ravenFhirServer;
    if (environment.ravenFhirServer.endsWith("/")) {
      cleanRavenFhirServerUrl = environment.ravenFhirServer.substring(0, environment.ravenFhirServer.length - 1)
    }

    if (request.url.startsWith(cleanRavenFhirServerUrl)) {
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
