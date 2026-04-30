import { APP_INITIALIZER, EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { AuthClientConfig, AuthModule } from '@auth0/auth0-angular';
import { ConfigService } from '../../config/config.service';

// Factory function to configure Auth0 after config is loaded
export function configureAuth0(authConfig: AuthClientConfig, configService: ConfigService) {
  return () => {
    return new Promise<void>((resolve) => {
      // Wait for config to be loaded
      configService.loadConfig().subscribe({
        next: (success) => {
          if (success && configService.config) {
            const config = configService.config;
            authConfig.set({
              domain: config.auth.domain,
              clientId: config.auth.clientId,
              authorizationParams: {
                redirect_uri: config.auth.redirectUrl,
                audience: config.auth.auth0.audience,
                scope: "admin profile email openid"
              },
              httpInterceptor: {
                allowedList: [
                  {
                    uri: `${config.dashboardApiUrl}admin-panel`,
                  },
                  {
                    uri: `${config.dashboardApiUrl}attachment/upload`
                  },
                  {
                    uri: `${config.dashboardApiUrl}attachment/download`
                  }
                ]
              }
            });
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  };
}

export function provideUserManagement(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'placeholder.auth0.com',
        clientId: 'placeholder-client-id',
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: 'placeholder-audience',
          scope: "admin profile email openid"
        },
        httpInterceptor: {
          allowedList: []
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth0,
      deps: [AuthClientConfig, ConfigService],
      multi: true
    }
  ]);
}
