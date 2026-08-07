import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ConfigService } from '../config/config.service';

/**
 * Guard to protect routes that require Search EDR OAuth credentials.
 * Returns true only if the credentials are properly configured in the config.
 */
export const bluejayCredentialsGuard: CanActivateFn = () => {
  const configService = inject(ConfigService);
  const config = configService.config();

  // Check if searchEdrOAuthCredentials exists and has required properties
  const searchEdrsCredentials = config?.workflowSimulator?.searchEdrOAuthCredentials;

  // Verify that credentials exist and have the essential properties
  return !!(
    searchEdrsCredentials &&
    searchEdrsCredentials.clientId &&
    searchEdrsCredentials.clientSecret &&
    searchEdrsCredentials.accessTokenUrl &&
    searchEdrsCredentials.audience &&
    searchEdrsCredentials.grantType
  );
};
