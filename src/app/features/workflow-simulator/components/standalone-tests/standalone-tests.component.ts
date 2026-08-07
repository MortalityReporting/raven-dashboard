import {Component, Inject, ChangeDetectionStrategy, computed} from '@angular/core';
import {Router} from "@angular/router";
import {Test} from "../../../tests";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {UiStringConstants} from "../../../../providers/ui-string-constants";
import {AppConfiguration} from "../../../../providers/app-configuration";
import {ConfigService} from "../../../../config/config.service";
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';

@Component({
    selector: 'app-standalone-tests',
    templateUrl: './standalone-tests.component.html',
    styleUrls: ['./standalone-tests.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButton, MatDivider]
})
export class StandaloneTestsComponent {

  appConfiguration: any = AppConfiguration.config;

  protected readonly standaloneTests = computed(() => {
    const allTests = this.uiStringConstants.WORKFLOW_STANDALONE_TESTS;
    const config = this.configService.config();
    const hasBlueJayCredentials = !!config?.workflowSimulator?.blueJayAuth0Credentials;

    // Filter out 'search-edrs-bluejay' if credentials are not configured
    return allTests.filter(test =>
      test.name !== 'search-edrs-bluejay' || hasBlueJayCredentials
    );
  });

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private router: Router,
    private uiStringConstants: UiStringConstants,
    private configService: ConfigService,
  ) {}

  onStartTest(test: Test) {
    this.router.navigate([`/workflow-simulator/${test.route}`]);
  }
}
