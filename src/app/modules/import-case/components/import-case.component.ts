import {Component, OnInit} from '@angular/core';
import {FileTemplate} from "../models/file-template";
import {FileTemplateService} from "../services/file-template.service";

@Component({
    selector: 'app-import-case',
    templateUrl: './import-case.component.html',
    styleUrls: ['./import-case.component.scss'],
    standalone: false
})

export class ImportCaseComponent implements OnInit {

  inputOptions: string[] = ['MDI FHIR Bundle', 'Template Spreadsheet'];
  selectedInputOption: string = this.inputOptions[0];
  fileTemplate: FileTemplate[] = [];

  constructor(
    private fileTemplateService: FileTemplateService
  ) { }

  ngOnInit(): void {
    this.fileTemplateService.getFileTemplates().subscribe({
      next: data => this.fileTemplate = data,
    });
  }

}
