import {Component, Inject, Input, OnInit} from '@angular/core';
import {FileTemplate} from "../../models/file-template";
import {ModuleHeaderConfig} from "../../../../../assets/configuration/module-header-config";
import {AppConfiguration} from "../../../../../assets/configuration/app-configuration";

@Component({
  selector: 'app-file-template',
  templateUrl: './file-template.component.html',
  styleUrls: ['./file-template.component.css']
})
export class FileTemplateComponent {
  @Input() fileTemplate: FileTemplate;

  constructor(
    @Inject('config') public config: ModuleHeaderConfig) {
  }

}