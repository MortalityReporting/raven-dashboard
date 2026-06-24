import {Component, EventEmitter, Inject, Output, ChangeDetectionStrategy} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import { MatNavList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-dcr-viewer-nav-menu',
    templateUrl: './dcr-viewer-nav-menu.component.html',
    styleUrl: './dcr-viewer-nav-menu.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatNavList, MatButton, MatIcon]
})
export class DcrViewerNavMenuComponent {
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
