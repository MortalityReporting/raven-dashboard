import { Component, OnInit } from '@angular/core';
import {ImportCaseService} from "../../../service/import-case.service";
import {UtilsService} from "../../../service/utils.service";


//TODO: Remove this code. It is only for testing the table.
const CASE_DATA = [
  {id: 1, name: "George Burdell", status: "Complete"},
  {id: 2, name: "Georgia Burdell", status: "Complete"},
  {id: 3, name: "John Doe", status: "Error"},
  {id: 4, name: "Jane Doe", status: "Error"},
  {id: 5, name: "Richard Smith", status: "Complete"},
]

@Component({
  selector: 'app-import-case-connectathon-template',
  templateUrl: './import-case-connectathon-template.component.html',
  styleUrls: ['./import-case-connectathon-template.component.css']
})
export class ImportCaseConnectathonTemplateComponent implements OnInit {

  isLoading: boolean = false;
  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  displayedColumns: string[] = ['id', 'name', 'status'];
  dataSource = CASE_DATA;
  caseNarrative: string = `<div><div class=\"hapiHeaderText\"> Achim-Uwe <b>BERGMANNSBERG </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>Pat-473</td></tr><tr><td>Address</td><td><span>Luebeck </span></td></tr><tr><td>Date of birth</td><td><span>04 June 1802</span></td></tr></tbody></table></div>`;

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
