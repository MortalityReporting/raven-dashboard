import { Component, OnInit } from '@angular/core';
import {ImportCaseService} from "../../services/import-case.service";
import {UtilsService} from "../../../../service/utils.service";
import {MatTableDataSource} from "@angular/material/table";
import {openModal} from "../../../../components/widgets/modal/modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-import-case-connectathon-template',
  templateUrl: './import-case-connectathon-template.component.html',
  styleUrls: ['./import-case-connectathon-template.component.scss']
})
export class ImportCaseConnectathonTemplateComponent implements OnInit {

  isLoading: boolean = false;
  selectedCase: any;
  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  displayedColumns: string[] = ['name', 'status', 'state'];
  dataSource = new MatTableDataSource<any>();
  isExportSuccessful: boolean = false;
  errorsGenerated: boolean = false;
  error: any;

  constructor(private importCaseService: ImportCaseService,
              private utilsService: UtilsService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.utilsService.closeNotification();

    this.file = event.target.files[0];

    if(!this.file){
      this.utilsService.showErrorMessage("Unable to open the file.");
    }
    else if (this.file.size > this.MAX_FILE_SIZE){
      console.error("File too big")
      this.utilsService.showErrorMessage("This file exceeds " + this.MAX_FILE_SIZE /  1000 + "kb and cannot be processed");
    }
    else {
      this.selectedCase = null;
      this.isExportSuccessful = false;
      this.errorsGenerated = false;
    }

  }

  clearUI() {
    // TODO reset the UI to it's initial state.
  }

  onSubmit() {
    this.utilsService.closeNotification();
    if(this.file) {
      this.isExportSuccessful = false;
      this.errorsGenerated = false;
      this.isLoading = true;
      this.error = null;
      //this.importCaseService.getMockResponse().subscribe({
      this.importCaseService.uploadFile(this.file).subscribe({
        next: value => {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(value);
          if(value?.length > 0){
            this.selectedCase = value[0];
          }
          else {
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
    else {
      this.utilsService.showErrorMessage("Please select a file to upload")
    }
  }

  onDownloadTemplate(){
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = 'https://github.com/MortalityReporting/raven-import-and-submit-api/blob/master/MDI_Raven_Excel_Schema.xlsx?raw=true';
    link.target="_blank";
    link.click();
    document.body.removeChild(link);
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
