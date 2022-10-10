import { Component, OnInit } from '@angular/core';
import {ImportCaseService} from "../../../../service/import-case.service";
import {UtilsService} from "../../../../service/utils.service";
import {HttpClient} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-import-case-connectathon-template',
  templateUrl: './import-case-connectathon-template.component.html',
  styleUrls: ['./import-case-connectathon-template.component.css']
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

  constructor(private importCaseService: ImportCaseService,
              private utilsService: UtilsService,
              private http:HttpClient) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {

    this.file = event.target.files[0];

    if(!this.file){
      this.utilsService.showErrorMessage("Unable to open the file.");
    }
    else if (this.file.size > this.MAX_FILE_SIZE){
      console.error("File too big")
      this.utilsService.showErrorMessage("This file exceeds " + this.MAX_FILE_SIZE /  1000 + "kb and cannot be processed");
    }

  }

  clearUI() {
    // TODO reset the UI to it's initial state.
  }

  onSubmit() {
    if(this.file) {
      this.isExportSuccessful = false;
      this.errorsGenerated = false;
      this.isLoading = true;
      this.importCaseService.uploadFile(this.file).subscribe({
        next: value => {
          this.isLoading = false;
          console.log(value);
          this.dataSource = new MatTableDataSource(value);
          if(value?.length > 0){
            this.selectedCase = value[0];
          }
          this.isExportSuccessful = true;
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
          this.utilsService.showErrorMessage("Error uploading file " + this.file?.name);
          this.file = null;
          this.errorsGenerated = true;
        }
      });
    }
    else {
      //TODO upload something else
    }

  }

}
