import { Injectable } from '@angular/core';
import { Observable, Subject} from "rxjs";
import {FileTemplate} from "../models/file-template";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileTemplateService {

  private selectedFileTemplate = new Subject<FileTemplate>();
  selectedFileTemplate$ = this.selectedFileTemplate.asObservable();
  setSelectedFileTemplate(selectedFileTemplate: FileTemplate) {
    this.selectedFileTemplate.next(selectedFileTemplate);
  }

  //TODO remove hardcoded url
  templatesUrl = "https://hapi.fhir.org/baseR4/DocumentReference?type=raven-template";
  constructor(private http:HttpClient) { }
  getFileTemplates(): Observable<FileTemplate[]>{
    return this.http.get(this.templatesUrl).pipe(map((result: any) => {
      const fileTemplateList: FileTemplate[] = result.entry.map(entry => {
        const fileTemplate: FileTemplate = { uri:  entry.resource.content[0].attachment.url, description: entry.resource.description };
        return fileTemplate;
      });
      return fileTemplateList;
    }));
  }
}
