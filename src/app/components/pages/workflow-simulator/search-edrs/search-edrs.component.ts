import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {openInputTextDialog} from "../../../widgets/input-text-dialog/input-text-dialog.component";
import {UtilsService} from "../../../../service/utils.service";

@Component({
  selector: 'app-search-edrs',
  templateUrl: './search-edrs.component.html',
  styleUrls: ['./search-edrs.component.css']
})
export class SearchEdrsComponent implements OnInit {

  inputTypeOptions: string[] = ['Registered Endpoint', 'Custom Endpoint'];

  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  fileContent: string;

  serverEndpointList: any[] = [
    {uri: 'www.bluejay.edu', displayName: 'BlueJay'},
    {uri: 'www.gavers.edu', displayName: 'Gavers'},
  ];

  endpointConfigurationFormGroup = this.formBuilder.group({
    inputType: [this.inputTypeOptions[0]],
    serverEndpoint: [this.serverEndpointList[0].uri]
  });

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
  }

  onSubmitEndpointConfiguration() {
    console.log(this.endpointConfigurationFormGroup);
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
