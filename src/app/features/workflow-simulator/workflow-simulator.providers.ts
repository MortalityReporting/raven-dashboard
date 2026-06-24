import { Provider } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { ModuleHeaderConfig } from '../../providers/module-header-config';

/**
 * Provides configuration and services for the Workflow Simulator module.
 * Replaces the WorkflowSimulatorModule.forRoot() pattern with a modern provider function.
 */
export function provideWorkflowSimulator(config: ModuleHeaderConfig, appConfig: any): Provider[] {
  return [
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
