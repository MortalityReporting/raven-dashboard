import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

/**
 * Conditional wrapper interceptor that only delegates to AuthHttpInterceptor
 * when Dashboard API services are enabled in the configuration.
 *
 * This interceptor checks the application configuration and conditionally
 * applies Auth0 authentication based on the enableDashboardApiServices flag.
 */
@Injectable()
export class ConditionalAuthInterceptor implements HttpInterceptor {
  constructor(
    private configService: ConfigService,
    private authInterceptor: AuthHttpInterceptor
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.configService.config?.enableDashboardApiServices) {
      // Pass through without Auth0 interception when Dashboard API services are disabled
      return next.handle(req);
    }
    // Delegate to Auth0 interceptor when Dashboard API services are enabled
    return this.authInterceptor.intercept(req, next);
  }
}
