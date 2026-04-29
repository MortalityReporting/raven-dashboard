import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestingEventsModule} from "../testing-events/testing-events.module";
import {ModuleHeaderConfig} from "../../providers/module-header-config";
import {StandaloneTestsComponent} from "./components/standalone-tests/standalone-tests.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {TestsModule} from "../tests/tests.module";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDivider} from "@angular/material/divider";
import {ConfigService} from "../../config/config.service";

@NgModule({
  declarations: [
    StandaloneTestsComponent,
  ],
  imports: [
    CommonModule,
    TestingEventsModule,
    TestsModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatDivider,
  ]
})
export class WorkflowSimulatorModule {

  public static forRoot(config: ModuleHeaderConfig, appConfig: any): ModuleWithProviders<any> {
    return {
      ngModule: WorkflowSimulatorModule,
      providers: [
        ConfigService,
        {
          provide: 'workflowSimulatorConfig',
          useValue: config
        },
        {
          provide: 'appConfig',
          useValue: appConfig
        }
      ]
    }
  }

}
