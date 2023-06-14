import { Injectable } from '@angular/core';
import { Observable, Subject} from "rxjs";
import {FileTemplate} from "../models/file-template";
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
          uri:  entry.resource.content[0].attachment.url,
          description: entry.resource.description,
          apiImportParameter: entry.resource?.extension?.find(extension => extension.url == "raven-import-api-parameter")?.valueString ?? ''
        };
        return fileTemplate;
      });
      return fileTemplateList;
    }));
  }
}
