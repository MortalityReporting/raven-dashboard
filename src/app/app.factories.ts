import { ConfigService } from './config/config.service';

export const configFactory = (configService: ConfigService) => {
  return () => configService.loadConfig();
};

export function fhirValidatorUrlFactory(configService: ConfigService) {
  return configService.config.fhirValidatorUrl;
}
