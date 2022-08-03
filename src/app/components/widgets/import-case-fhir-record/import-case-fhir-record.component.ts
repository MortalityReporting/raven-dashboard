import { Component, OnInit } from '@angular/core';
import {ImportCaseService} from "../../../service/import-case.service";
import {UtilsService} from "../../../service/utils.service";

@Component({
  selector: 'app-import-case-fhir-record',
  templateUrl: './import-case-fhir-record.component.html',
  styleUrls: ['./import-case-fhir-record.component.css']
})
export class ImportCaseFhirRecordComponent implements OnInit {

  isLoading: boolean = false;
  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  fileContent: string;

  constructor(private importCaseService: ImportCaseService,
              private utilsService: UtilsService) { }

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
    else {

      const reader = new FileReader();
      reader.readAsText(this.file, "UTF-8");
      reader.onload = () => {
        this.fileContent = reader.result as string;
      }
      reader.onerror = () => {
        this.utilsService.showErrorMessage("Unable to open the file.");
      }
    }
  }

  clearUI() {
    // TODO reset the UI to it's initial state.
  }

  onSubmit() {
    let fileType = null;
    if(this.file?.type){
      fileType = this.file.type;
    }
    else if (this.utilsService.isXmlString(this.fileContent)){
      fileType = 'xml';
    }
    else if (this.utilsService.isJsonString(this.fileContent)){
      fileType = 'json';
    }
    else {
      this.utilsService.showErrorMessage("Unable to recognise the text format or the file type. " +
        "Only xml and json formats are acceptable.")
      console.error("Only json and xml are acceptable file formats!");
      return;
    }

    this.isLoading = true;
    this.importCaseService.uploadFileContent(this.fileContent, fileType).subscribe({
      next: value => {
        this.isLoading = false
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.utilsService.showErrorMessage("Error uploading file " + this.file?.name);
      }
    });
  }

}
