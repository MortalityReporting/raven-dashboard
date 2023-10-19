import { Component, OnInit } from '@angular/core';
import {ImportCaseService} from "../services/import-case.service";
import {FileTemplate} from "../models/file-template";
import {Observable} from "rxjs";
import {FileTemplateService} from "../services/file-template.service";
@Component({
  selector: 'app-import-case',
  templateUrl: './import-case.component.html',
  styleUrls: ['./import-case.component.scss']
})

export class ImportCaseComponent implements OnInit {

  inputOptions: string[] = ['MDI FHIR Bundle', 'Template Spreadsheet'];
  selectedInputOption: string = this.inputOptions[0];
  fileTemplates$: Observable<FileTemplate[]>;

  constructor(
    private fileTemplateService: FileTemplateService
  ) { }

  ngOnInit(): void {
    this.fileTemplates$ = this.fileTemplateService.getFileTemplates();
  }

}
