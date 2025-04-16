import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {AppConfiguration} from "../../../../../providers/app-configuration";

@Component({
  selector: 'app-dcr-viewer-nav-menu',
  standalone: false,
  templateUrl: './dcr-viewer-nav-menu.component.html',
  styleUrl: './dcr-viewer-nav-menu.component.css'
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
