import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ConfigService} from "../config/config.service";

@Injectable()
export class FhirAuthInterceptor implements HttpInterceptor {

  constructor(private configService: ConfigService) {}

  // TODO: Fix so headers are added regardless of trailing slash.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const config = this.configService.config;

    // If config not loaded yet, pass through without modification
    if (!config) {
      return next.handle(request);
    }

    if (request.url.startsWith(config.ravenFhirServer.baseUrl)) {
      let basicAuthCredentials = config.ravenFhirServer.basicAuth; // Format presumes user:pass
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
