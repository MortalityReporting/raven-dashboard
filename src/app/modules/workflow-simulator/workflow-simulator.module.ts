import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestingEventsModule} from "../testing-events/testing-events.module";
import {ModuleHeaderConfig} from "../../providers/module-header-config";
import {StandaloneTestsComponent} from "./components/standalone-tests/standalone-tests.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {TestsModule} from "../tests/tests.module";
import { WorkflowSimulatorComponent } from './components/workflow-simulator/workflow-simulator.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatDivider} from "@angular/material/divider";

@NgModule({
  declarations: [
    StandaloneTestsComponent,
    WorkflowSimulatorComponent,
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

  public static forRoot(environment: any, config: ModuleHeaderConfig, appConfig: any): ModuleWithProviders<any> {
    return {
      ngModule: WorkflowSimulatorModule,
      providers: [
        {
          provide: 'env',
          useValue: environment
        },
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
