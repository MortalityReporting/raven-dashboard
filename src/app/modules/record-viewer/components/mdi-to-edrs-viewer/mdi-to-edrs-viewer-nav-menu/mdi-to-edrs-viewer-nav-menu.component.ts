import {Component, Inject} from '@angular/core';
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";

@Component({
  selector: 'record-viewer-mdi-to-edrs-viewer-nav-menu',
  templateUrl: './mdi-to-edrs-viewer-nav-menu.component.html',
  styleUrls: ['../mdi-to-edrs-viewer.component.css', '../../../record-viewer-styles.scss']
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
