import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ConfigService} from "../config/config.service";
import {Config} from "../config/config";

@Injectable()
export class FhirAuthInterceptor implements HttpInterceptor {

  config: Config;
  constructor(private configService: ConfigService) {
    this.config = configService.config;
  }

  // TODO: Fix so headers are added regardless of trailing slash.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(this.config.ravenFhirServer.baseUrl)) {
      let basicAuthCredentials = this.config.ravenFhirServer.basicAuth; // Format presumes user:pass
      let basicAuthHeader = 'Basic ' + btoa(basicAuthCredentials);
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/fhir+json',
          'Authorization': basicAuthHeader
        }
      });
    }
    return next.handle(request);
  }
}
