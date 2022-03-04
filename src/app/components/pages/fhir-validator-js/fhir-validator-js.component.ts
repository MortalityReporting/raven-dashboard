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
  parsedFhirResource: string= '';

  response = {
      "resourceType" : "Observation",
      "id" : "observation-death-date-j-rogers",
      "meta" : {
        "versionId" : "1",
        "lastUpdated" : "2022-02-17T03:30:31.175+00:00",
        "source" : "#HxNQbdXHR9YLhjG8",
        "profile" : [
          "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date"
        ]
      },
      "status" : "final",
      "component" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://loinc.org",
                "code" : "80616-6",
                "display" : "Date and time pronounced dead [US Standard Certificate of Death]"
              }
            ]
          },
          "valueDateTime" : "2022-01-04T05:30:00-05:00"
        }
      ]
    }


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
  //  this.parsedFhirResource = JSON.stringify(this.response, null, 2)
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
    const lines = this.fhirResource.split('\n');
    console.log(lines);
    for (let i = 0; i < lines.length; i++) {
      // let line = i++;
      if (i == 2) {
        let tempText = '<mark>' + lines[i] + '</mark>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      } else {
        this.parsedFhirResource += lines[i];
        this.parsedFhirResource += '\n';
      }
    }
    console.log(this.parsedFhirResource);
    // this.validationErrorStr = this.fhirValidatorService.getUiValidationMessages(fhirResource, resourceFormat);
    // if(this.validationErrorStr){
    //   this.isValidErrorMsgRendered = true;
    //   this.isValidResourceMsgRendered = false;
    // }
    // else {
    //   this.isValidErrorMsgRendered = false;
    //   this.isValidResourceMsgRendered = true;
    // }
    // this.fhirResource = this.parsedFhirResource
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
