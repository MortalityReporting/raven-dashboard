import {Component, Inject, Input, OnInit} from '@angular/core';
import {ImportCaseService} from "../../services/import-case.service";
import {UtilsService} from "../../../../service/utils.service";

import {openModal} from "../../../../components/widgets/modal/modal.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {FileTemplate} from "../../models/file-template";
import {FileTemplateService} from "../../services/file-template.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";


@Component({
  selector: 'app-import-case-connectathon-template',
  templateUrl: './import-case-connectathon-template.component.html',
  styleUrls: ['./import-case-connectathon-template.component.scss']
})
export class ImportCaseConnectathonTemplateComponent implements OnInit {
  @Input() fileTemplates: FileTemplate[] = []

  isLoading: boolean = false;
  selectedCase: any;
  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  displayedColumns: string[] = ['name', 'status', 'state'];
  dataSource = new MatTableDataSource<any>();
  isExportSuccessful: boolean = false;
  errorsGenerated: boolean = false;
  error: any;

  fileTemplate = new FormControl('', [Validators.required]);

  importCaseForm = new FormGroup({
    fileTemplate: new FormControl<FileTemplate| null>(null,[Validators.required])
  });

  constructor(
    @Inject('importConfig') public config: ModuleHeaderConfig,
    private importCaseService: ImportCaseService,
    private fileTemplateService: FileTemplateService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
 ) { }

  ngOnInit(): void {

    this.fileTemplateService.selectedFileTemplate$.subscribe({
      next: value =>
          this.importCaseForm.controls['fileTemplate'].setValue(this.fileTemplates.find(template => template.description == value.description))
      }
    );
  }

  onFileSelected(event: any) {
    this.utilsService.closeNotification();
    this.importCaseForm.controls['fileTemplate'].enable();

    this.file = event.target.files[0];

    if (!this.file) {
      this.utilsService.showErrorMessage("Unable to open the file.");
      return;
    }
    if (this.file.size > this.MAX_FILE_SIZE) {
      console.error("File too big")
      this.utilsService.showErrorMessage("This file exceeds " + this.MAX_FILE_SIZE / 1000 + "kb and cannot be processed");
      return;
    }
    this.selectedCase = null;
    this.isExportSuccessful = false;
    this.errorsGenerated = false;
  }

  clearUI() {
    // TODO reset the UI to it's initial state.
  }

  onSubmit() {
    if (this.importCaseForm.valid) {
      this.utilsService.closeNotification();
      if (this.file) {
        this.isExportSuccessful = false;
        this.errorsGenerated = false;
        this.isLoading = true;
        this.error = null;
        //this.importCaseService.getMockResponse().subscribe({
        const apiParam = this.importCaseForm.controls['fileTemplate'].value.apiImportParameter;
        this.importCaseService.uploadFile(this.file, apiParam).subscribe({
          next: value => {
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(value);
            if (value?.length > 0) {
              this.selectedCase = value[0];
            } else {
              this.selectedCase = null;
            }
            this.isExportSuccessful = true;
          },
          error: err => {
            console.error(err);
            this.error = err;
            this.isLoading = false;
            this.utilsService.showErrorMessage("Error uploading file " + this.file?.name);
            this.file = null;
            this.errorsGenerated = true;
          }
        });
      }
    }
  }

  scrollToTop(el: HTMLDivElement) {
    el.scrollTop = 0;
  }

  onExpandFhirBundle() {
    openModal(
      this.dialog,
      {
        title: "MDI FHIR Bundle",
        content: this.selectedCase?.fhirBundle,
        contentType: 'json'
      })
      .subscribe();
  }
}
