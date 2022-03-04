import {Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../service/utils.service";
import {FhirValidatorService} from "../../../service/fhir-validator.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-fhir-validator-js',
  templateUrl: './fhir-validator-js.component.html',
  styleUrls: ['./fhir-validator-js.component.css'],
})
export class FhirValidatorJsComponent implements OnInit {
  fhirResource: string ='';
  resourceFormat = 'json';
  fileName: string;
  validationErrorStr: string;
  isValidErrorMsgRendered = false;
  isFormattingPerformedRendered = false;
  isValidResourceMsgRendered = false;

  constructor(
    private utilsService: UtilsService,
    private fhirValidatorService: FhirValidatorService,
    private _snackBar: MatSnackBar,
  ) { }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate its operation.
  onFormatInput() {
    this.isFormattingPerformedRendered = true;

    if(this.fhirResource
      && (this.utilsService.isXmlString(this.fhirResource) || this.utilsService.isJsonString(this.fhirResource)))
      {
        if(this.resourceFormat === 'json' && this.utilsService.isJsonString(this.fhirResource)){
          setTimeout(() => this.isFormattingPerformedRendered = false, 2000);
        }
        else if(this.resourceFormat === 'xml' && this.utilsService.isXmlString(this.fhirResource)){
          this.fhirResource = this.utilsService.beautifyXML(this.fhirResource);
          setTimeout(() => this.isFormattingPerformedRendered = false, 2000);
        }
        else {
          setTimeout(() => this.isFormattingPerformedRendered = false, 2000);
        }
    }
    else {
      this.isFormattingPerformedRendered = true;
      setTimeout(() => this.isFormattingPerformedRendered = false, 2000);
    }
  }

  ngOnInit(): void {
  }

  clearUI(){
    this.fhirResource='';
    this.fileName=''
    this.validationErrorStr = '';
    this.isFormattingPerformedRendered = false;
    this.isValidErrorMsgRendered = false;
    this.isValidResourceMsgRendered = false;
  }

  onClear(){
    this.clearUI();
  }

  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {

      // auto toggle the file type radio buttons
      if (file.type === "text/xml"){
        this.resourceFormat = 'xml';
      }
      else if ("application/json"){
        this.resourceFormat = 'json';
      }

      // set the filename in the UI
      this.fileName = file.name;

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = () => {
        this.fhirResource = reader.result as string;
      }
      reader.onerror =  () => {
        this._snackBar.open("Unable to open the file.", 'x' ,{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-color']
        });
      }

    }
    else {
      this._snackBar.open("Unable to open the file.", 'x' ,{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['danger-color']
      });
    }
  }

  validateFhirResource(fhirResource: any, resourceFormat: string) {
    this.validationErrorStr = this.fhirValidatorService.getUiValidationMessages(fhirResource, resourceFormat);
    if(this.validationErrorStr){
      this.isValidErrorMsgRendered = true;
      this.isValidResourceMsgRendered = false;
    }
    else {
      this.isValidErrorMsgRendered = false;
      this.isValidResourceMsgRendered = true;
    }
  }

  onPasteFhirResource(event: ClipboardEvent) {
    // If not text is present in the textarea (this.fhirResource is empty) we toggle the  radio buttons
    // based on the input text format.
    if(!this.fhirResource) {
      this.clearUI();
      let text = event.clipboardData.getData('text');
      if (this.utilsService.isJsonString(text)) {
        this.resourceFormat = 'json';
      } else if (this.utilsService.isXmlString(text)) {
        this.resourceFormat = 'xml';
      }
    }
  }
}
