import { Component, OnInit } from '@angular/core';
import {ImportCaseService} from "../services/import-case.service";
import {FileTemplate} from "../models/file-template";
import {Observable} from "rxjs";
@Component({
  selector: 'app-import-case',
  templateUrl: './import-case.component.html',
  styleUrls: ['./import-case.component.scss']
})

export class ImportCaseComponent implements OnInit {

  inputOptions: string[] = ['MDI-to-EDRS Document', 'MDI-to-EDRS XLSX Template (XLSX File)'];
  selectedInputOption: string = this.inputOptions[0];
  fileTemplates$: Observable<FileTemplate[]>;

  constructor(
    private importCaseService: ImportCaseService
  ) { }

  ngOnInit(): void {
    this.fileTemplates$ = this.importCaseService.getFileTemplates();
  }

}
