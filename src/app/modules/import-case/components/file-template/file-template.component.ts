import {Component, Inject, Input} from '@angular/core';
import {FileTemplate} from "../../models/file-template";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FileTemplateService} from "../../services/file-template.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {UpperCasePipe} from "@angular/common";

@Component({
    selector: 'app-file-template',
    templateUrl: './file-template.component.html',
    styleUrls: ['./file-template.component.css'],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        UpperCasePipe
    ]
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
