import {Component, Inject} from '@angular/core';
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";

@Component({
  selector: 'app-mdi-to-edrs-viewer-nav-menu',
  templateUrl: './mdi-to-edrs-viewer-nav-menu.component.html',
  styleUrls: ['./mdi-to-edrs-viewer-nav-menu.component.css']
})
export class MdiToEdrsViewerNavMenuComponent {

  constructor(
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) {
  }

  onItemClick(id: string) {
    //this.caseSummaryContentComponent.onSetState(id, true);
  }
}
