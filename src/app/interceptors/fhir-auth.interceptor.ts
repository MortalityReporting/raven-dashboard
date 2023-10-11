import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ConfigService} from "../service/config.service";
import {Config} from "../model/config";

@Injectable()
export class FhirAuthInterceptor implements HttpInterceptor {

  config: Config;
  constructor(private configService: ConfigService) {
    this.config = configService.config;
  }

  // TODO: Fix so headers are added regardless of trailing slash.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(this.config.ravenFhirServerBaseUrl)) {
      let basicAuthCredentials = this.config.ravenFhirServerBasicAuth; // Format presumes user:pass
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
