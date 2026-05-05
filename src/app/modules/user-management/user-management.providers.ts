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
        const config = configService.config;
        const authConfig = new AuthClientConfig();
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
