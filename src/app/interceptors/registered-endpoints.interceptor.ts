import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ConfigService} from "../config/config.service";
import {Config} from "../config/config";

@Injectable()
export class RegisteredEndpointsInterceptor implements HttpInterceptor {
  config: Config;
  registeredEndpoints: any[];
  ignoreList = ["assets/", "../assets/", "../../assets/"];
  skipInterceptor = false;

  constructor(private configService: ConfigService) {
    this.config = configService.config;
    // Normalize URLs to ensure they end with /
    this.registeredEndpoints = [
      {
        "baseUrl": this.normalizeUrl(this.config.dashboardApiUrl),
        "allowedEndpoints": [
          "*"
        ]
      },
      {
        "baseUrl": this.normalizeUrl(this.config.fhirValidatorUrl),
        "allowedEndpoints": [
          "$validate",
          "$translate",
          "$packages"
        ]
      },
      {
        "baseUrl": this.normalizeUrl(this.config.ravenFhirServer.baseUrl),
        "allowedEndpoints": [
          "*"
        ]
      },
      {
        "baseUrl": this.normalizeUrl(this.config.ravenImportApiUrl),
        "allowedEndpoints": [
          "*"
        ]
      }
    ]
  }

  /**
   * Normalize URL to ensure it ends with /
   * This matches the behavior of EnvironmentHandler.getApiUrl()
   */
  private normalizeUrl(url: string): string {
    if (!url.endsWith("/")) {
      return url.concat("/");
    }
    return url;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.skipInterceptor) {
      return next.handle(request);
    }
    let service = this.registeredEndpoints.find(service => request.url.startsWith(service.baseUrl));
    if (this.ignoreList.some(item => request.url.startsWith(item))) {
      return next.handle(request);
    }
    else if (!service) {
      console.info(`${request.url} is not registered with the application (nor on the ignore list).`)
      return next.handle(request);
    }
    else {
      let service = this.registeredEndpoints.find(service => request.url.startsWith(service.baseUrl));
      // baseUrl already ends with / from EnvironmentHandler.getApiUrl()
      if (service?.allowedEndpoints?.some(endpoint =>
        endpoint === "*" || request.url === service.baseUrl + endpoint
      )) {
        return next.handle(request);
      }
      else {
        return throwError(() => new Error(`${request.url} does not match a registered URL.`));
      }
    }
  }

}
