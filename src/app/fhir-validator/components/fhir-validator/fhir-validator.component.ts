import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {DomSanitizer} from "@angular/platform-browser";
import {FhirValidatorService} from "../../service/fhir-validator.service";
import {ValidatorConstants} from "../../providers/validator-constants";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.css']
})
export class FhirValidatorComponent implements OnInit {

  fhirResource: string ='';
  resourceFormat = 'json';
  fileName: string;
  validationErrorStr: string;
  isErrorMsgRendered = false;
  isFormattingPerformedRendered = false;
  isValidResourceMsgRendered = false;
  hasBackendValidationErrors = false;
  parsedFhirResource : any;
  displayedColumns: string[] = ['severity', 'fhirPath', 'message', 'location'];
  selectedProfile: any;
  isLoading = false;
  apiErrorResponse: any;

  // apiErrorResponse = [
  //   {
  //     "severity": "Warning",
  //     "fhirPath": "Patient.address[0].state",
  //     "location": "(line 4, col24)",
  //     "message": "The value provided ('Texas') is not in the value set http://hl7.org/fhir/us/core/ValueSet/us-core-usps-state (http://hl7.org/fhir/us/core/ValueSet/us-core-usps-state), and a code should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable)  (error message = The code \"Texas\" is not valid in the system https://www.usps.com/; The code provided (https://www.usps.com/#Texas) is not valid in the value set 'UspsTwoLetterAlphabeticCodes' (from http://tx.fhir.org/r4))\r\n"
  //   },
  //   {
  //     "severity": "Warning",
  //     "fhirPath": "Patient.address[0].use",
  //     "location": "(line 6, col6)",
  //     "message": "ValueSet http://hl7.org/fhir/ValueSet/address-use|4.0.1 not found by validator"
  //   },
  //   {
  //     "severity": "Error",
  //     "fhirPath": "Patient.identifier[0].type",
  //     "location": "(line 9, col20)",
  //     "message": "None of the codings provided are in the value set http://hl7.org/fhir/ValueSet/identifier-type (http://hl7.org/fhir/ValueSet/identifier-type), and a coding should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable) (codes = http://cbsig.chai.gatech.edu/CodeSystem/cbs-temp-code-system#Local-Record-ID)"
  //   },
  //   {
  //     "severity": "Error",
  //     "fhirPath": "Patient.identifier[0].type",
  //     "location": "(line 120, col20)",
  //     "message": "None of the codings provided are in the value set http://hl7.org/fhir/ValueSet/identifier-type (http://hl7.org/fhir/ValueSet/identifier-type), and a coding should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable) (codes = http://cbsig.chai.gatech.edu/CodeSystem/cbs-temp-code-system#Local-Record-ID)"
  //   }
  // ];

  // response = {
  //   "resourceType" : "Observation",
  //   "id" : "observation-death-date-j-rogers",
  //   "meta" : {
  //     "versionId" : "1",
  //     "lastUpdated" : "2022-02-17T03:30:31.175+00:00",
  //     "source" : "#HxNQbdXHR9YLhjG8",
  //     "profile" : [
  //       "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date"
  //     ]
  //   },
  //   "status" : "final",
  //   "component" : [
  //     {
  //       "code" : {
  //         "coding" : [
  //           {
  //             "system" : "http://loinc.org",
  //             "code" : "80616-6",
  //             "display" : "Date and time pronounced dead [US Standard Certificate of Death]"
  //           }
  //         ]
  //       },
  //       "valueDateTime" : "2022-01-04T05:30:00-05:00"
  //     }
  //   ]
  // }


  constructor(
    private fhirValidatorService: FhirValidatorService,
    private _snackBar: MatSnackBar,
    private sanitized: DomSanitizer,
    public constants: ValidatorConstants
  ) { }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate its operation.
  onFormatInput() {
    this.isFormattingPerformedRendered = true;

    if(this.fhirResource
      && (this.fhirValidatorService.isXmlString(this.fhirResource) || this.fhirValidatorService.isJsonString(this.fhirResource)))
    {
      if(this.resourceFormat === 'json' && this.fhirValidatorService.isJsonString(this.fhirResource)){
        setTimeout(() => this.isFormattingPerformedRendered = false, 2000);
      }
      else if(this.resourceFormat === 'xml' && this.fhirValidatorService.isXmlString(this.fhirResource)){
        this.fhirResource = this.fhirValidatorService.beautifyXML(this.fhirResource);
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
    this.isErrorMsgRendered = false;
    this.isValidResourceMsgRendered = false;
    this.parsedFhirResource = null;
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
      //see if we can find any obvious issues with the resource here
      this.isErrorMsgRendered = true;
      this.isValidResourceMsgRendered = false;
    }
    else {
      // The UI validation passed successfully, and we execute the backend validation.
      this.executeAPIValidation(fhirResource, resourceFormat);
    }
  }

  onPasteFhirResource(event: ClipboardEvent) {
    // If not text is present in the textarea (this.fhirResource is empty) we toggle the  radio buttons
    // based on the input text format.
    if(!this.fhirResource) {
      this.clearUI();
      let text = event.clipboardData.getData('text');
      if (this.fhirValidatorService.isJsonString(text)) {
        this.resourceFormat = 'json';
      } else if (this.fhirValidatorService.isXmlString(text)) {
        this.resourceFormat = 'xml';
      }
    }
  }

  getErrorLineNumbers(apiResponse: any): number[]{
    if(!apiResponse || apiResponse.length === 0){
      return null;
    }
    return apiResponse
      .filter((element: any) => element.severity == 'Error')
      .map((element: any) => this.getLineNumberFromLocation(element.location) - 1);
  };

  getWarningWarningLineNumber(apiResponse: any): number[]{
    if(!apiResponse || apiResponse.length === 0){
      return null;
    }
    return apiResponse
      .filter((element: any) => element.severity == 'Warning')
      .map((element: any) => this.getLineNumberFromLocation(element.location) - 1);
  };

  escapeHtml(str: string): string {
    // We escape all html tags in order to render the html as text in the innerHTML div
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  renderAPIValidationErrors(apiResponse: any) {

    const errorLineNumbers = this.getErrorLineNumbers(apiResponse);
    const warningLineNumbers = this.getWarningWarningLineNumber(apiResponse);

    if(errorLineNumbers?.length > 0 || warningLineNumbers?.length > 0){
      this.hasBackendValidationErrors = true;
      this.validationErrorStr = "Please see the validation errors below.";
      this.isErrorMsgRendered = true;
    }

    const lines = this.fhirResource.split('\n');
    lines.forEach((line, i) => {
      const sanitized = this.escapeHtml(line);
      if(!this.parsedFhirResource){
        this.parsedFhirResource = '';
      }
      if(errorLineNumbers.indexOf(i) != -1){
        let tempText = '<span class="error-mark" id="error' + i + '">' + sanitized + '</span>';
        console.log(tempText);
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else if(warningLineNumbers.indexOf(i) != -1){
        let tempText = '<span class="warning-mark" id="warning' + i + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else {
        this.parsedFhirResource += sanitized;
        this.parsedFhirResource += '\n';
      }
    });
    this.parsedFhirResource = this.sanitized.bypassSecurityTrustHtml(this.parsedFhirResource);
    if(!this.hasBackendValidationErrors){
      this.isValidResourceMsgRendered = true;
    }
  }

  scrollToElement(location: string ): void {
    const element = document.querySelector(location);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  getLineNumberFromLocation(locationStr: string): number {
    // Here we grab the location from response not in (line 6, col 5) response
    return parseInt (locationStr.split(",")[0].replace( /^\D+/g, ''));
  }

  onLocationSelected(response: any): void {
    let locationId = ('#'+ response.severity + this.getLineNumberFromLocation(response.location)).toLowerCase();
    this.scrollToElement(locationId);
  }

  private executeAPIValidation(fhirResource: any, resourceFormat: string) {
    this.isLoading = true;
    this.fhirValidatorService.validateFhirResource(fhirResource, resourceFormat).subscribe((response: any) => {
      if(false){ //TODO we still don't know exactly what a valid fhir resource response looks like

      }
      else {
        console.log(response);
        this.apiErrorResponse = response;
        this.renderAPIValidationErrors(response);
      }
    },
      ()=> {this.isLoading = false;},
      () => {
        this.isLoading = false;
      }
    )

  }

  onSelectProfile(event: any) {
    this.selectedProfile = event.value;
  }

}
