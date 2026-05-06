import {Provider} from '@angular/core';
import {ModuleHeaderConfig} from "../../providers/module-header-config";
import {ConfigService} from "../../config/config.service";

/**
 * Provides the configuration and services needed for the FHIR Validator module
 * @param config - Module header configuration
 * @param appConfig - Application configuration
 * @returns Array of providers for the FHIR Validator
 */
export function provideFhirValidator(config: ModuleHeaderConfig, appConfig: any): Provider[] {
  return [
    ConfigService,
    {
      provide: 'fhirValidatorConfig',
      useValue: config
    },
    {
      provide: 'appConfig',
      useValue: appConfig
    },
    {
      provide: 'serverBaseUrl',
      useFactory: (configService: ConfigService) => {
        return configService.config?.fhirValidatorUrl || '';
      },
      deps: [ConfigService]
    }
  ];
}
