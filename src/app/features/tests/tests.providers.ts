import { Provider } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ConfigService } from '../../config/config.service';
import { ModuleHeaderConfig } from '../../providers/module-header-config';

/**
 * Provides configuration and services for the Tests module.
 * Replaces the TestsModule.forRoot() pattern with a modern provider function.
 */
export function provideTests(config: ModuleHeaderConfig, appConfig: any): Provider[] {
  return [
    provideNativeDateAdapter(),
    ConfigService,
    {
      provide: 'workflowSimulatorConfig',
      useValue: config
    },
    {
      provide: 'appConfig',
      useValue: appConfig
    }
  ];
}
