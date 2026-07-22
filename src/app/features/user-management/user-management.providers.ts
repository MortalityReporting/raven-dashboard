import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { AuthClientConfig, AuthModule } from '@auth0/auth0-angular';
import { ConfigService } from '../../config/config.service';

export function provideUserManagement(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(
      AuthModule.forRoot()
    ),
    {
      provide: AuthClientConfig,
      useFactory: (configService: ConfigService) => {
        const config = configService.config();
        if (!config) {
          throw new Error('Configuration not loaded. Ensure config initializer runs before provideUserManagement()');
        }

        const authConfig = new AuthClientConfig();

        // Only configure Auth0 if auth is enabled
        if (!config.enableDashboardApiServices || !config.auth) {
          // Return a minimal no-op configuration when auth is disabled
          authConfig.set({
            domain: '',
            clientId: '',
            authorizationParams: {
              redirect_uri: '',
              audience: '',
              scope: ''
            }
          });
          return authConfig;
        }

        // Configure Auth0 when auth is enabled
        authConfig.set({
          domain: config.auth.domain,
          clientId: config.auth.clientId,
          cacheLocation: 'localstorage',
          useRefreshTokens: true,
          authorizationParams: {
            redirect_uri: config.auth.redirectUrl,
            audience: config.auth.auth0.audience,
            scope: "admin profile email openid offline_access"
          },
          httpInterceptor: {
            allowedList: [
              { uri: `${config.dashboardApiUrl}admin-panel` },
              { uri: `${config.dashboardApiUrl}attachment/upload` },
              { uri: `${config.dashboardApiUrl}attachment/download` }
            ]
          }
        });
        return authConfig;
      },
      deps: [ConfigService]
    }
  ]);
}
