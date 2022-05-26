import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {FhirValidatorService} from "../../service/fhir-validator.service";
import {ValidatorConstants} from "../../providers/validator-constants";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {UtilsService} from "../../service/utils.service";

export interface ResponseItem {
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
  isFormattingPerformedRendered = false;
  hasResponseData = false;
  parsedFhirResource : any;
  displayedColumns: string[] = ['toggle', 'icon', 'severity', 'fhirPath', 'location'];
  isLoading = false;
  apiResponse: any = [];
  allExpanded = true;
  severityLevels: string[] = ['error', 'warning', 'information', 'note'];
  severityLevelsFormControl = new FormControl(this.severityLevels);
  dataSource = new MatTableDataSource([]);
  validatorSubscription$: Subscription;
  validationFinished = false;
  isValidResource = false;
  fileMaxSize = 100000;
  serverErrorDetected = false;
  serverErrorList: any [];
  serverErrorStatus: string;

  constructor(
    private fhirValidatorService: FhirValidatorService,
    private sanitized: DomSanitizer,
    public constants: ValidatorConstants,
    private utilsService: UtilsService
  ) {
  }

  formatFhirResource(){
    if(this.fhirResource){
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
    this.utilsService.showSuccessMessage("Formatting Attempted.");
  }

  ngOnInit(): void {
  }

  clearUI(){
    this.fhirResource='';
    this.fileName=''
    this.validationErrorStr = '';
    this.isFormattingPerformedRendered = false;
    this.isValidResource = false;
    this.parsedFhirResource = null;
    this.hasResponseData = false;
    this.isValidResource = false;
    this.validationFinished = false;
    this.isLoading = false;
    this.serverErrorDetected = false;
    this.serverErrorList = [];
    this.serverErrorStatus = '';
  }

  onClear(){
    this.clearUI();
  }

  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {
      if(file.size > this.fileMaxSize){
        console.error("File too big")
        this.utilsService.showErrorMessage("This file exceeds " + this.fileMaxSize + " and cannot be processed");
      }
      else {
        // auto toggle the file type radio buttons
        if (file.type === "text/xml") {
          this.resourceFormat = 'xml';
        } else if ("application/json") {
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
          this.utilsService.showErrorMessage("Unable to open the file.");
        }
      }

    }
    else {
      this.utilsService.showErrorMessage("Unable to open the file.");
    }
  }

  validateFhirResource(fhirResource: any, resourceFormat: string) {

    this.isValidResource = true;
    this.hasResponseData = false;
    this.serverErrorList = [];
    this.serverErrorStatus = '';
    this.serverErrorDetected = false;
    this.severityLevelsFormControl.patchValue(this.severityLevels);

    this.validationErrorStr = this.fhirValidatorService.getUiValidationMessages(fhirResource, resourceFormat);
    if(this.validationErrorStr){
      //see if we can find any obvious issues with the resource here
      this.isValidResource = false;
      this.validationFinished = true;
    }
    else {
      // The UI validation passed successfully, and we execute the backend validation.
      this.executeAPIValidation(fhirResource, resourceFormat);
    }
  }

  onPasteFhirResource(event: ClipboardEvent) {
    this.fileName = '';
    if(!this.fhirResource) {
      this.clearUI();
    }
    let text = event.clipboardData.getData('text');
    if (this.fhirValidatorService.isJsonString(text)) {
      this.resourceFormat = 'json';
    } else if (this.fhirValidatorService.isXmlString(text)) {
      this.resourceFormat = 'xml';
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

  renderAPIResponseData(apiResponse: any) {

    const errorLineNumbers = this.getLineNumbersBySeverity(apiResponse.issues, 'Error');
    const warningLineNumbers = this.getLineNumbersBySeverity(apiResponse.issues, 'Warning');
    const infoLineNumbers = this.getLineNumbersBySeverity(apiResponse.issues, 'Information');
    const noteLineNumbers = this.getLineNumbersBySeverity(apiResponse.issues, 'Note');

    if(errorLineNumbers?.length > 0
      || warningLineNumbers?.length > 0
      || infoLineNumbers?.length > 0
      || noteLineNumbers?.length > 0)
    {
      this.hasResponseData = true;
    }

    let lines = apiResponse.formattedResource.split('\n');
    lines.forEach((line: string, i: number) => {

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
      else if(noteLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="note-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else {
        this.parsedFhirResource += sanitized;
        this.parsedFhirResource += '\n';
      }
    });
    this.parsedFhirResource = this.sanitized.bypassSecurityTrustHtml(this.parsedFhirResource);
  }

  escapeHtml(str: string): string {
    // We escape all html tags in order to render the html as text in the innerHTML div
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  scrollToElement(location: string ): void {
    const element = document.querySelector(location);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  getLineNumberFromLocation(locationStr: string): number {
    // We grab the location from response
    return (locationStr?.length > 0) ? parseInt (locationStr.split(",")[0].replace( /^\D+/g, '')) : null;
  }

  // When the user selects a location from the errors and warning results, we want to scroll the page to that location
  onLocationSelected(response: any): void {
    let locationId = ('#mark' + this.getLineNumberFromLocation(response.location)).toLowerCase();
    this.scrollToElement(locationId);
  }

  private executeAPIValidation(fhirResource: any, resourceFormat: string) {
    this.isLoading = true;
    this.parsedFhirResource = null;
    this.validationFinished = false;

    if(this.resourceFormat === "json"){
      fhirResource = JSON.parse(fhirResource);
    }
    else if(this.resourceFormat === "xml"){
      let fhirResourceXML = new DOMParser().parseFromString(fhirResource, 'text/xml');
      fhirResource = fhirResourceXML.documentElement.outerHTML;
    }

    this.validatorSubscription$ = this.fhirValidatorService.validateFhirResource(fhirResource, resourceFormat).subscribe({
      next: (response) => {
        this.validationFinished = true;

        let issues = response.issues;
        if(issues.length === 1 && issues[0].severity === "Information" && issues[0]?.message === "ALL OK"){
          this.isValidResource = true;
        }
        else {
          this.isValidResource = false;
          this.validationErrorStr = "Please see the validation errors below.";
        }
        issues.forEach((element: any) => element.message = element.message.replace(/,(?=[^\s])/g, ", "));

        // sort by line numbers
        issues = issues.sort((a: any, b: any) => {
          return this.getLineNumberFromLocation(a.location) - this.getLineNumberFromLocation(b.location);
        });

        this.dataSource.data = issues.map((element: any) => {
          let result: ResponseItem = Object.assign({}, element);
          result.expanded = true;
          return result
        });

        this.dataSource.filterPredicate = this.getFilterPredicate();

        this.renderAPIResponseData(response);

      },
      error: (err) => {
        this.isLoading = false;
        this.serverErrorDetected = true;
        this.serverErrorStatus = err.status;
        if(err?.error?.issue){
          this.serverErrorList = err.error.issue;
        }
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  toggle() {
    this.allExpanded = !this.allExpanded;
    this.dataSource.data.forEach(item => item.expanded = this.allExpanded);
  }

  onFilterResults() {
    this.dataSource.filter = this.severityLevelsFormControl.value.join(',');
  }

  getFilterPredicate() {
    return function (row: any, filters: string) {
      let matchFilter: boolean = false;
      const filterArray = filters.split(',');
      filterArray.forEach((filter: string) => {
        if(row.severity.toLowerCase().indexOf(filter.toLowerCase())!= -1){
            matchFilter = true;
          }
        }
      )
      return matchFilter;
    };
  }

  onCancelValidation (){
    this.validatorSubscription$.unsubscribe();
    this.isLoading = false;
  }

  checkExpandCollapseAllStatus() {
    // When all elements are collapsed we want to change the expansion icon to render "expand all"
    // When all elements are expanded we want to change the expansion icon to "collapse all"
    // This will save extra unnecessary click for the user
    const expandedElementsCount = this.dataSource.data.filter(element => element.expanded).length;
    if(expandedElementsCount === this.dataSource.data.length){
      this.allExpanded = true;
    }
    else if(expandedElementsCount === 0){
      this.allExpanded = false;
    }
  }

  isFilterEnabled(severity: string) {
    return !!this.dataSource.data.find(element => element.severity.toLowerCase() === severity.toLowerCase());
  }

  getCount(level: any) {
    return this.dataSource.data
      .filter(element => element.severity.toLowerCase() === level.toLowerCase())
      .length;
  }

  onCloseServerErrorMessage() {
    this.serverErrorDetected = false;
    this.serverErrorList = [];
    this.serverErrorStatus = '';
  }
}
