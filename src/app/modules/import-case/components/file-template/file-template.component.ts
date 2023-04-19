import {Component, Inject, Input, OnInit} from '@angular/core';
import {FileTemplate} from "../../models/file-template";
import {ModuleHeaderConfig} from "../../../../../assets/configuration/module-header-config";
import {FileTemplateService} from "../../services/file-template.service";

@Component({
  selector: 'app-file-template',
  templateUrl: './file-template.component.html',
  styleUrls: ['./file-template.component.css']
})
export class FileTemplateComponent {
  @Input() fileTemplate: FileTemplate;

  constructor(
    @Inject('importConfig') public config: ModuleHeaderConfig,
    private fileTemplateService: FileTemplateService) {
  }

  onTemplateSelected(fileTemplate: FileTemplate) {
    this.fileTemplateService.setSelectedFileTemplate(fileTemplate);
  }
}
