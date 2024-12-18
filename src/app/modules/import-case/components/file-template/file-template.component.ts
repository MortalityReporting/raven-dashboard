import {Component, Inject, Input} from '@angular/core';
import {FileTemplate} from "../../models/file-template";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FileTemplateService} from "../../services/file-template.service";

@Component({
    selector: 'app-file-template',
    templateUrl: './file-template.component.html',
    styleUrls: ['./file-template.component.css'],
    standalone: false
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
