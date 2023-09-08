import { Injectable } from '@angular/core';
import { Observable, Subject} from "rxjs";
import {FileTemplate, TemplateContent} from "../models/file-template";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {EnvironmentHandlerService} from "../../fhir-util";

@Injectable({
  providedIn: 'root'
})
export class FileTemplateService {

  private selectedFileTemplate = new Subject<FileTemplate>();
  selectedFileTemplate$ = this.selectedFileTemplate.asObservable();
  setSelectedFileTemplate(selectedFileTemplate: FileTemplate) {
    this.selectedFileTemplate.next(selectedFileTemplate);
  }

  constructor(
    private http:HttpClient,
    private environmentHandler: EnvironmentHandlerService
  ) { }
  getFileTemplates(): Observable<FileTemplate[]>{
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + 'DocumentReference?type=raven-template').pipe(map((result: any) => {
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
