import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ConfigService } from '../config/config.service';

/**
 * Guard to protect routes that require BlueJay Auth0 credentials.
 * Returns true only if the credentials are properly configured in the config.
 */
export const bluejayCredentialsGuard: CanActivateFn = () => {
  const configService = inject(ConfigService);
  const config = configService.config();

  // Check if blueJayAuth0Credentials exists and has required properties
  const bluejayCredentials = config?.workflowSimulator?.blueJayAuth0Credentials;

  // Verify that credentials exist and have the essential properties
  return !!(
    bluejayCredentials &&
    bluejayCredentials.clientId &&
    bluejayCredentials.clientSecret &&
    bluejayCredentials.accessTokenUrl &&
    bluejayCredentials.audience &&
    bluejayCredentials.grantType
  );
};
