import { Injectable, Injector } from '@angular/core';
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
  private authInterceptor: AuthHttpInterceptor | null = null;

  constructor(
    private configService: ConfigService,
    private injector: Injector
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Always pass through if Dashboard API services are disabled
    console.log("I am running")
    if (!this.configService.config?.enableDashboardApiServices) {
      return next.handle(req);
    }

    // Check if this request is for a Dashboard API endpoint
    const dashboardApiUrl = this.configService.config.dashboardApiUrl;
    const isDashboardApiRequest = req.url.startsWith(dashboardApiUrl);

    // Only delegate to Auth0 interceptor for Dashboard API requests
    if (isDashboardApiRequest) {
      console.log("I am intercepted")
      // Lazy load AuthHttpInterceptor to avoid circular dependency issues
      if (!this.authInterceptor) {
        this.authInterceptor = this.injector.get(AuthHttpInterceptor);
      }
      return this.authInterceptor.intercept(req, next);
    }

    // Pass through all other absolute URLs without Auth0 interception
    return next.handle(req);
  }
}
