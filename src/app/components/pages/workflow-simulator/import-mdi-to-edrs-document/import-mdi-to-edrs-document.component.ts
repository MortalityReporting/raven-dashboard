import { Component, OnInit } from '@angular/core';
import {openInputTextDialog} from "../../../widgets/input-text-dialog/input-text-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UtilsService} from "../../../../service/utils.service";

@Component({
  selector: 'app-import-mdi-to-edrs-document',
  templateUrl: './import-mdi-to-edrs-document.component.html',
  styleUrls: ['./import-mdi-to-edrs-document.component.css']
})
export class ImportMdiToEdrsDocumentComponent implements OnInit {

  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  fileContent: string;

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
  }

  onInputMdiToEdrsBundle() {
    this.file = null;
    openInputTextDialog(
      this.dialog,
      {
        title: "Input MDI to EDRS Document Bundle ",
        primaryActionBtnTitle: "Save",
        secondaryActionBtnTitle: "Cancel",
        isPrimaryButtonLeft: false
      })
      .subscribe(
        data => {
          console.log(data);
        }
      );
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
}
