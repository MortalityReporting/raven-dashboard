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
  isLoading = false;
  apiErrorResponse: any;
  selectedProfile: any;

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
        this.fhirResource = this.fhirValidatorService.beautifyJSON(this.fhirResource);
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
  }

  clearUI(){
    this.fhirResource='';
    this.fileName=''
    this.validationErrorStr = '';
    this.isFormattingPerformedRendered = false;
    this.isErrorMsgRendered = false;
    this.isValidResourceMsgRendered = false;
    this.parsedFhirResource = null;
    this.apiErrorResponse = null;
    this.hasBackendValidationErrors = false;
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

  validateFhirResource(fhirResource: any, resourceFormat: string, selectedProfile: any) {

    this.validationErrorStr = this.fhirValidatorService.getUiValidationMessages(fhirResource, resourceFormat);
    if(this.validationErrorStr){
      //see if we can find any obvious issues with the resource here
      this.isErrorMsgRendered = true;
      this.isValidResourceMsgRendered = false;
    }
    else {
      // The UI validation passed successfully, and we execute the backend validation.
      this.executeAPIValidation(fhirResource, resourceFormat ,selectedProfile);
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
      if(errorLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="error-mark" id="error' + i + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else if(warningLineNumbers?.indexOf(i) != -1){
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

  private executeAPIValidation(fhirResource: any, resourceFormat: string, selectedProfile: any) {
    this.isLoading = true;
    this.parsedFhirResource = null;
    this.apiErrorResponse = null;
    this.fhirValidatorService.validateFhirResource(fhirResource, resourceFormat, selectedProfile).subscribe({
      next: (response) => {
        if(false){ //TODO we still don't know exactly what a valid fhir resource response looks like

        }
        else {
          response.forEach((element: any) => element.message = element.message .replace(/,(?=[^\s])/g, ", "));
          this.apiErrorResponse = response;
          this.renderAPIValidationErrors(response);
        }
      },
      error: () => {
        this._snackBar.open("Server error occurred.", 'x' ,{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-color']
        });
        this.isLoading = false;
      },
      complete:  () => {
        this.isLoading = false;
      }
    });
  }

  onSelectProfile(event: any) {
    this.selectedProfile = event.value;
  }

  onSelectedProfileLink(selectedProfile: any) {
    window.open(selectedProfile.url);
  }
}
