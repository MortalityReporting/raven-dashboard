import {Component, Inject, ChangeDetectionStrategy} from '@angular/core';
import {Router} from "@angular/router";
import {Test} from "../../../tests";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {UiStringConstants} from "../../../../providers/ui-string-constants";
import {AppConfiguration} from "../../../../providers/app-configuration";
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';

@Component({
    selector: 'app-standalone-tests',
    templateUrl: './standalone-tests.component.html',
    styleUrls: ['./standalone-tests.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton, MatDivider]
})
export class StandaloneTestsComponent {

  appConfiguration: any = AppConfiguration.config;
  standaloneTests: Test[];
  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private router: Router,
    private uiStringConstants: UiStringConstants,
  ) {
    this.standaloneTests = uiStringConstants.WORKFLOW_STANDALONE_TESTS
  }

  onStartTest(test: Test) {
    this.router.navigate([`/workflow-simulator/${test.route}`]);
  }
}
