import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import { MatNavList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-nav-menu',
    templateUrl: './tox-to-mdi-viewer-nav-menu.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    imports: [MatNavList, MatButton, MatIcon]
})
export class ToxToMdiViewerNavMenuComponent {
  @Output() menuClickEvent = new EventEmitter<string>()

  constructor(
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration
  ) {
  }

  onItemClick(id: string) {
    this.menuClickEvent.emit(id);
  }
}
