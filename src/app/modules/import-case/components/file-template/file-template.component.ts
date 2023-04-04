import {Component, Inject, Input, OnInit} from '@angular/core';
import {FileTemplate} from "../../models/file-template";
import {ModuleHeaderConfig} from "../../../../../assets/configuration/module-header-config";

@Component({
  selector: 'app-file-template',
  templateUrl: './file-template.component.html',
  styleUrls: ['./file-template.component.css']
})
export class FileTemplateComponent {
  @Input() fileTemplate: FileTemplate;

  constructor(
    @Inject('importConfig') public config: ModuleHeaderConfig) {
    console.log(config);
  }

}
