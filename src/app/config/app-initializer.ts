import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';

/**
 * Factory function to load application configuration during bootstrap.
 * This runs during application initialization via APP_INITIALIZER.
 */
export function configFactory(configService: ConfigService) {
  return () => firstValueFrom(configService.loadConfig());
}
