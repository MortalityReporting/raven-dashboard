import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {DomSanitizer} from "@angular/platform-browser";
import {FhirValidatorService} from "../../service/fhir-validator.service";
import {ValidatorConstants} from "../../providers/validator-constants";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";

export interface WarningError {
  severity: string;
  message: string;
  location: string;
  expanded: boolean;
}


@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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
  displayedColumns: string[] = ['toggle', 'icon', 'severity', 'fhirPath', 'location'];
  isLoading = false;
  apiErrorResponse: any = [];
  selectedProfile: any;
  allExpanded = true;
  dataSource = new MatTableDataSource(
    [
      {
        "severity": "Warning",
        "fhirPath": "Patient.address[0].state",
        "location": "(line 4, col24)",
        "message": "The value provided ('Texas') is not in the value set http://hl7.org/fhir/us/core/ValueSet/us-core-usps-state (http://hl7.org/fhir/us/core/ValueSet/us-core-usps-state), and a code should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable)  (error message = The code \"Texas\" is not valid in the system https://www.usps.com/; The code provided (https://www.usps.com/#Texas) is not valid in the value set 'UspsTwoLetterAlphabeticCodes' (from http://tx.fhir.org/r4))\r\n",
        "expanded": true
      },
      {
        "severity": "Warning",
        "fhirPath": "Patient.address[0].use",
        "location": "(line 6, col6)",
        "message": "ValueSet http://hl7.org/fhir/ValueSet/address-use|4.0.1 not found by validator",
        "expanded": true
      },
      {
        "severity": "Error",
        "fhirPath": "Patient.identifier[0].type",
        "location": "(line 9, col20)",
        "message": "None of the codings provided are in the value set http://hl7.org/fhir/ValueSet/identifier-type (http://hl7.org/fhir/ValueSet/identifier-type), and a coding should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable) (codes = http://cbsig.chai.gatech.edu/CodeSystem/cbs-temp-code-system#Local-Record-ID)",
        "expanded": true,
      },
      {
        "severity": "Error",
        "fhirPath": "Patient.identifier[0].type",
        "location": "(line 17, col20)",
        "message": "None of the codings provided are in the value set http://hl7.org/fhir/ValueSet/identifier-type (http://hl7.org/fhir/ValueSet/identifier-type), and a coding should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable) (codes = http://cbsig.chai.gatech.edu/CodeSystem/cbs-temp-code-system#Local-Record-ID)",
        "expanded": true,
      }
    ]
  );


  constructor(
    private fhirValidatorService: FhirValidatorService,
    private _snackBar: MatSnackBar,
    private sanitized: DomSanitizer,
    public constants: ValidatorConstants,

  ) {
  }

  formatFhirResource(){
    if(this.fhirResource
      && (this.fhirValidatorService.isXmlString(this.fhirResource) || this.fhirValidatorService.isJsonString(this.fhirResource)))
    {
      if(this.resourceFormat === 'json' && this.fhirValidatorService.isJsonString(this.fhirResource)){
        this.fhirResource = this.fhirValidatorService.beautifyJSON(this.fhirResource);
      }
      else if(this.resourceFormat === 'xml' && this.fhirValidatorService.isXmlString(this.fhirResource)){
        this.fhirResource = this.fhirValidatorService.beautifyXML(this.fhirResource);
      }
    }
  }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate its operation.
  onFormatInput() {
    this.formatFhirResource()
    this.isFormattingPerformedRendered = true;
    setTimeout(() => this.isFormattingPerformedRendered = false, 2000);
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
        this.formatFhirResource();
      }
      reader.onerror = () => {
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
    // If no text is present in the textarea (this.fhirResource is empty) we toggle the  radio buttons
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

  getLineNumbersBySeverity(apiResponse: any, severity: string): number[]{
    if(!apiResponse || apiResponse.length === 0){
      return null;
    }
    return apiResponse
      .filter((element: any) => element.severity == severity)
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

    const errorLineNumbers = this.getLineNumbersBySeverity(apiResponse, 'Error');
    const warningLineNumbers = this.getLineNumbersBySeverity(apiResponse, 'Warning');
    const infoLineNumbers = this.getLineNumbersBySeverity(apiResponse, 'Information');

    if(errorLineNumbers?.length > 0 || warningLineNumbers?.length > 0 || infoLineNumbers.length > 0){
      this.hasBackendValidationErrors = true;
      this.validationErrorStr = "Please see the validation errors below.";
      this.isErrorMsgRendered = true;
    }

    const lines = this.fhirResource.split('\n');
    lines.forEach((line, i) => {
      let offsetLine = i + 1;
      const sanitized = this.escapeHtml(line);
      if(!this.parsedFhirResource){
        this.parsedFhirResource = '';
      }
      if(errorLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="error-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else if(warningLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="warning-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else if(infoLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="info-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
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
    console.log(location);
    const element = document.querySelector(location);
    console.log(element);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  getLineNumberFromLocation(locationStr: string): number {
    // We grab the location from response
    return parseInt (locationStr.split(",")[0].replace( /^\D+/g, ''));
  }

  // When the user selects a location from the errors and warning results, we want to scroll the page to that location
  onLocationSelected(response: any): void {
    let locationId = ('#mark' + this.getLineNumberFromLocation(response.location)).toLowerCase();
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

          // sort by line numbers
          response = response.sort((a: any, b: any) => {
            return this.getLineNumberFromLocation(a.location) - this.getLineNumberFromLocation(b.location);
          });
          this.dataSource.data = response.map((element: any) => {
            let result: WarningError = Object.assign({}, element);
              result.expanded = true;
              return result});
          this.apiErrorResponse = response;

          this.dataSource.filterPredicate =
            (data: any, filter: string) => data.severity.indexOf(filter) != -1;

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
      complete: () => {
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

  toggle() {
    this.allExpanded = !this.allExpanded;
    this.dataSource.data.forEach(item => item.expanded = this.allExpanded);
  }

  onFilterResults(filterValue: string) {
    this.dataSource.filter = filterValue;
  }
}

const response = [
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[8].resource.status",
    "location": "(line 433, col37)",
    "message": "Value is 'preliminary' but must be 'final'"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[13].resource.status",
    "location": "(line 576, col37)",
    "message": "Value is 'preliminary' but must be 'final'"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[4].resource.ofType(Observation).value.ofType(CodeableConcept).coding[0]",
    "location": "(line 320, col29)",
    "message": "Coding.system must be an absolute reference, not a local reference"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[4].resource.value.ofType(CodeableConcept).coding[0]",
    "location": "(line 320, col29)",
    "message": "Coding.system must be an absolute reference, not a local reference"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[8].resource.value.ofType(CodeableConcept)",
    "location": "(line 445, col28)",
    "message": "None of the codings provided are in the value set 'ValueSet - Death Pregnancy Status' (http://hl7.org/fhir/us/mdi/ValueSet/ValueSet-death-pregnancy-status), and a coding from this value set is required) (codes = http://snomed.info/sct#PHC1260)"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[14].resource.ofType(Condition).category[0].coding[0]",
    "location": "(line 621, col29)",
    "message": "Unknown Code http://terminology.hl7.org/CodeSystem/condition-category#health-concern in http://terminology.hl7.org/CodeSystem/condition-category for 'http://terminology.hl7.org/CodeSystem/condition-category#health-concern'"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[14].resource.category[0].coding[0]",
    "location": "(line 621, col29)",
    "message": "Unknown Code http://terminology.hl7.org/CodeSystem/condition-category#health-concern in http://terminology.hl7.org/CodeSystem/condition-category for 'http://terminology.hl7.org/CodeSystem/condition-category#health-concern'"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[0]",
    "location": "(line 12, col16)",
    "message": "Except for transactions and batches, each entry in a Bundle must have a fullUrl which is the identity of the resource in the entry  "
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle.entry[0]",
    "location": "(line 12, col16)",
    "message": "Bundle entry missing fullUrl"
  },
  {
    "severity": "Error",
    "fhirPath": "Bundle",
    "location": "(line 1, col2)",
    "message": "bdl-10: 'A document must have a date' Rule 'A document must have a date' Failed"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[0]",
    "location": "(line 12, col16)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[0].resource.section[0].entry[0]",
    "location": "(line 58, col28)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[0].resource.section[1].entry[3]",
    "location": "(line 74, col21)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[0].resource.section[3].entry[2]",
    "location": "(line 98, col21)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[0].resource.section[4].entry[0]",
    "location": "(line 108, col28)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[1].resource.section[0].entry[0]",
    "location": "(line 160, col28)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[1].resource.section[1].entry[3]",
    "location": "(line 176, col21)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[1].resource.section[3].entry[2]",
    "location": "(line 200, col21)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[1].resource.section[4].entry[0]",
    "location": "(line 210, col28)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[2]",
    "location": "(line 215, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[3]",
    "location": "(line 271, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[4]",
    "location": "(line 289, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[4].resource.value.ofType(CodeableConcept).coding[0]",
    "location": "(line 320, col29)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/odh/StructureDefinition/odh-UsualWork"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[4].resource.component[0].value.ofType(CodeableConcept).coding[0]",
    "location": "(line 335, col33)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/odh/StructureDefinition/odh-UsualWork"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[5]",
    "location": "(line 356, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[6]",
    "location": "(line 372, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[7]",
    "location": "(line 399, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[8]",
    "location": "(line 425, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[9]",
    "location": "(line 452, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[10]",
    "location": "(line 483, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[11]",
    "location": "(line 505, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[12]",
    "location": "(line 542, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[13]",
    "location": "(line 568, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[14]",
    "location": "(line 598, col9)",
    "message": "This element does not match any known slice defined in the profile http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[4].resource.ofType(Observation).value.ofType(CodeableConcept).coding[0]",
    "location": "(line 320, col29)",
    "message": "Code System URI '2.16.840.1.114222.4.5.314' is unknown so the code cannot be validated"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[4].resource.value.ofType(CodeableConcept).coding[0]",
    "location": "(line 320, col29)",
    "message": "Code System URI '2.16.840.1.114222.4.5.314' is unknown so the code cannot be validated"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[4].resource.ofType(Observation).component[0].value.ofType(CodeableConcept).coding[0]",
    "location": "(line 335, col33)",
    "message": "Code System URI 'https://terminology.hl7.org/2.0.0/CodeSystem-PHIndustryCDCCensus2010' is unknown so the code cannot be validated"
  },
  {
    "severity": "Information",
    "fhirPath": "Bundle.entry[4].resource.component[0].value.ofType(CodeableConcept).coding[0]",
    "location": "(line 335, col33)",
    "message": "Code System URI 'https://terminology.hl7.org/2.0.0/CodeSystem-PHIndustryCDCCensus2010' is unknown so the code cannot be validated"
  },
  {
    "severity": "Warning",
    "fhirPath": "Bundle.entry[16]",
    "location": "(line 113, col9)",
    "message": "Entry 'Composition/06cf3699-1894-4b64-9fc2-7c11ae7de85a' isn't reachable by traversing forwards from first Bundle entry, and isn't a resource type that is typically used that way - check this is not missed somewhere"
  },
  {
    "severity": "Warning",
    "fhirPath": "Bundle.entry[4].resource.ofType(Observation).category[0]",
    "location": "(line 298, col27)",
    "message": "Display Name for http://terminology.hl7.org/CodeSystem/observation-category#social-history should be one of 'Social History' instead of 'social-history'"
  },
  {
    "severity": "Warning",
    "fhirPath": "Bundle.entry[4].resource.category[0]",
    "location": "(line 298, col27)",
    "message": "Display Name for http://terminology.hl7.org/CodeSystem/observation-category#social-history should be one of 'Social History' instead of 'social-history'"
  },
  {
    "severity": "Warning",
    "fhirPath": "Bundle.entry[8].resource.ofType(Observation).value.ofType(CodeableConcept).coding[0]",
    "location": "(line 445, col29)",
    "message": "Error from server: Concept not found (next char = \"P\", in \"PHC1260\") at character 1"
  },
  {
    "severity": "Warning",
    "fhirPath": "Bundle.entry[8].resource.value.ofType(CodeableConcept).coding[0]",
    "location": "(line 445, col29)",
    "message": "Error from server: Concept not found (next char = \"P\", in \"PHC1260\") at character 1"
  },
  {
    "severity": "Warning",
    "fhirPath": "Bundle.entry[14].resource.ofType(Condition).category[0]",
    "location": "(line 620, col27)",
    "message": "None of the codings provided are in the value set 'Condition Category Codes' (http://hl7.org/fhir/ValueSet/condition-category), and a coding should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable) (codes = http://terminology.hl7.org/CodeSystem/condition-category#health-concern)"
  },
  {
    "severity": "Warning",
    "fhirPath": "Bundle.entry[14].resource.category[0]",
    "location": "(line 620, col27)",
    "message": "None of the codings provided are in the value set 'US Core Condition Category Codes' (http://hl7.org/fhir/us/core/ValueSet/us-core-condition-category), and a coding should come from this value set unless it has no suitable code (note that the validator cannot judge what is suitable) (codes = http://terminology.hl7.org/CodeSystem/condition-category#health-concern)"
  }
]
