import {Component, Inject, input, ChangeDetectionStrategy} from '@angular/core';
import {FileTemplate} from "../../models/file-template";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FileTemplateService} from "../../services/file-template.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {UpperCasePipe} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-file-template',
    templateUrl: './file-template.component.html',
    styleUrls: ['./file-template.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        UpperCasePipe
    ]
})
export class FileTemplateComponent {
  fileTemplate = input.required<FileTemplate>();

  constructor(
    @Inject('importConfig') public config: ModuleHeaderConfig,
    private fileTemplateService: FileTemplateService,
    private http: HttpClient) {
  }

  downloadFile(fileTemplate: FileTemplate) {
    const uri = fileTemplate.templateContent[0].uri;
    const downloadUrl = this.getDownloadUrl(uri);

    this.http.get(downloadUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.getFileName(uri);
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
      }
    });

    this.onTemplateSelected(fileTemplate);
  }

  private getDownloadUrl(uri: string): string {
    // Convert GitHub blob URL to raw download URL
    if (uri.includes('github.com') && uri.includes('/blob/')) {
      return uri.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return uri;
  }

  private getFileName(uri: string): string {
    return uri.substring(uri.lastIndexOf('/') + 1);
  }

  onTemplateSelected(fileTemplate: FileTemplate) {
    this.fileTemplateService.setSelectedFileTemplate(fileTemplate);
  }

}
