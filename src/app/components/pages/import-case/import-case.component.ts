import { Component, OnInit } from '@angular/core';
import {ImportCaseService} from "../../../service/import-case.service";
import {UtilsService} from "../../../fhir-validator/service/utils.service";

@Component({
  selector: 'app-import-case',
  templateUrl: './import-case.component.html',
  styleUrls: ['./import-case.component.css']
})

export class ImportCaseComponent implements OnInit {

  isLoading: boolean = false;
  inputOptions: string[] = ['FHIR Record', 'Connectathon Template(.XLS File)'];
  selectedInputOption: string = this.inputOptions[0];
  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB

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

  }

  clearUI() {
    // TODO reset the UI to it's initial state.
  }

  onSubmit() {
    if(this.file) {
      this.isLoading = true;
      this.importCaseService.uploadFile(this.file).subscribe({
          next: value => {
            this.isLoading = false
          },
          error: err => {
            console.error(err);
            this.isLoading = false;
            this.utilsService.showErrorMessage("Error uploading file " + this.file?.name);
            this.file = null;
          }
        });
    }
    else {
      //TODO upload something else
    }

  }
}
