import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {ModuleHeaderConfig} from "../../providers/module-header-config";
import {ConfigService} from "../../config/config.service";

export function provideImportCase(config: ModuleHeaderConfig, appConfig: any): EnvironmentProviders {
  return makeEnvironmentProviders([
    ConfigService,
    {
      provide: 'importConfig',
      useValue: config
    },
    {
      provide: 'appConfig',
      useValue: appConfig
    }
  ]);
}
