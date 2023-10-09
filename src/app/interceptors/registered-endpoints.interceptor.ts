import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ConfigService} from "../service/config.service";
import {Config} from "../model/config";

@Injectable()
export class RegisteredEndpointsInterceptor implements HttpInterceptor {
  config: Config;
  registeredEndpoints: any[];
  ignoreList = ["assets/", "../assets/", "../../assets/"];
  skipInterceptor = false;

  constructor(private configService: ConfigService) {
    this.config = configService.config;
    this.registeredEndpoints = [
      {
        "baseUrl": this.config.fhirValidatorUrl,
        "allowedEndpoints": [
          "$validate",
          "$translate"
        ]
      },
      {
        "baseUrl": this.config.ravenFhirServerBaseUrl,
        "allowedEndpoints": [
          "*"
        ]
      },
      {
        "baseUrl": this.config.ravenImportApiUrl,
        "allowedEndpoints": [
          "*"
        ]
      }
    ]
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
      if (service?.allowedEndpoints?.some(endpoint => request.url === service.baseUrl + endpoint || endpoint === "*")) {
        return next.handle(request);
      }
      else {
        return throwError(() => new Error(`${request.url} does not match a registered URL.`));
      }
    }
  }

}
