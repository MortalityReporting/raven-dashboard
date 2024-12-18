import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {Test} from "../../../tests";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {UiStringConstants} from "../../../../providers/ui-string-constants";
import {AppConfiguration} from "../../../../providers/app-configuration";

@Component({
    selector: 'app-standalone-tests',
    templateUrl: './standalone-tests.component.html',
    styleUrls: ['./standalone-tests.component.scss'],
    standalone: false
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
