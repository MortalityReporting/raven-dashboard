import { Injectable } from '@angular/core';
import { Observable, Subject} from "rxjs";
import {FileTemplate, TemplateContent} from "../models/file-template";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../../service/config.service";
import {Config} from "../../../model/config";

@Injectable({
  providedIn: 'root'
})
export class FileTemplateService {

  private selectedFileTemplate = new Subject<FileTemplate>();
  selectedFileTemplate$ = this.selectedFileTemplate.asObservable();
  setSelectedFileTemplate(selectedFileTemplate: FileTemplate) {
    this.selectedFileTemplate.next(selectedFileTemplate);
  }
  config: Config;
  constructor(
    private http:HttpClient,
    private configService: ConfigService
  ) {
    this.config = this.configService.config;
  }

  getFileTemplates(): Observable<FileTemplate[]>{
    return this.http.get(this.config.ravenFhirServerBaseUrl + 'DocumentReference?type=raven-template').pipe(map((result: any) => {
      const fileTemplateList: FileTemplate[] = result.entry.map(entry => {
        const fileTemplate: FileTemplate = {
          description: entry.resource.description,
          apiImportParameter: entry.resource?.extension?.find(extension => extension.url == "raven-import-api-parameter")?.valueString ?? '',

          templateContent: entry.resource.content.map(element => {
            const templateContent: TemplateContent = {
              uri: element.attachment.url,
              contentType: element.attachment.contentType,
              fileExtension: element.attachment.url.substring(element.attachment.url.length, (element.attachment.url.lastIndexOf('.')) + 1)
            }
            return templateContent;
          })
        };

        return fileTemplate;
      });
      return fileTemplateList;
    }));
  }
}
