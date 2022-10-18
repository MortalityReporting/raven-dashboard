import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {FhirValidatorService} from "../../service/fhir-validator.service";
import {ValidatorConstants} from "../../providers/validator-constants";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {UtilsService} from "../../../service/utils.service";
import {ValidationResults} from "../../domain/ValidationResoults";

export interface ResponseItem {
  severity: string;
  message: string;
  location: string;
  expanded: boolean;
}

@Component({
  selector: 'app-validator-core',
  templateUrl: './validator-core.component.html',
  styleUrls: ['./validator-core.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ValidatorCoreComponent implements OnInit, OnChanges {

  @Input() isStandalone: boolean = true;
  @Input() renderValidationDetails: boolean = true;

  fhirResource: string = ''; // The Resource.
  resourceFormat = 'json'; // The resource format could be JSON or XML, with JSON being the default format.
  fileName: string; // Name of the file uploaded by the user. We need this to render the filename in the UI.
  validationErrorStr: string; // We use this value to store preliminary error messages or a generic error message.
  hasResponseData = false;  // Indicates if the response generated any messages. If true, we render the report
  parsedFhirResource: any; // We store value of the validator result in order to present it to the user.
  displayedColumns: string[] = ['toggle', 'icon', 'severity', 'fhirPath', 'location'];
  isLoading = false;
  allExpanded = true; // Used to render collapsed/expanded all icon as well as calculate if all results are expanded/collapsed
  severityLevels: string[] = ['error', 'warning', 'information', 'note'];
  severityLevelsFormControl = new FormControl(this.severityLevels); // A simple form control used for filtering the results.
  dataSource = new MatTableDataSource([]); // Data source for the report table.
  validatorSubscription$: Subscription;
  validationFinished = false;
  isValidResource = false; // We use this to render the success message
  maxFileSize = 100000; // Max allowed file size is 100KB
  serverErrorDetected = false; // Tracks if the server has responded with an error (404, 500). Used to render the error in UI.
  serverErrorList: any []; // Store the data from the OperationOutcome resource
  serverErrorStatus: string; // We store the error response status here (i.e. 404, 500)
  validationResults: ValidationResults = {};

  //TODO remove this code when the API returns a timeout error
  serverTimoutDetected = false;
  SERVER_TIMEOUT_INTERVAL = 240000; //four minutes

  constructor(
    private fhirValidatorService: FhirValidatorService,
    private sanitized: DomSanitizer,
    public constants: ValidatorConstants,
    private utilsService: UtilsService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes['fhirResource'].currentValue){
    //   this.fhirValidatorService.setFhirResource(changes['fhirResource'].currentValue);
    // }
  }

  ngOnInit(): void {
      //Track the fhir resource injected from parent other components.
      this.fhirValidatorService.getFhirResource().subscribe({
        next: value => this.fhirResource = value
      });

      this.fhirValidatorService.setValidationResults({});
  }

  formatFhirResource(){
    if(this.fhirResource){
      if(this.resourceFormat === 'json' && this.fhirValidatorService.isJson(this.fhirResource)){
        this.fhirResource = this.fhirValidatorService.beautifyJSON(this.fhirResource);
        this.fhirValidatorService.setFhirResource(this.fhirResource);
      }
      else if(this.resourceFormat === 'xml' && this.fhirValidatorService.isXmlString(this.fhirResource)){
        this.fhirResource = this.fhirValidatorService.beautifyXML(this.fhirResource);
        this.fhirValidatorService.setFhirResource(this.fhirResource);
      }
    }
  }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate its operation.
  onFormatInput() {
    this.formatFhirResource()
    this.utilsService.showSuccessMessage("Formatting Attempted.");
  }

  clearUI(){
    this.fhirResource='';
    this.fileName=''
    this.clearValidationErrors();
  }

  onClear(){
    this.clearUI();
  }

  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {
      if(file.size > this.maxFileSize){
        console.error("File too big")
        this.utilsService.showErrorMessage("This file exceeds " + this.maxFileSize /  1000 + "kb and cannot be processed");
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
          this.fhirValidatorService.setFhirResource(this.fhirResource);
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

  validateFhirResource(fhirResource?: any, resourceFormat?: string) {
    // Set the stage for the validation. Reset variables to default values.
    if(!fhirResource){
      fhirResource = this.fhirResource
    }
    if(!resourceFormat){
      resourceFormat = this.resourceFormat
    }

    if(!fhirResource || !(resourceFormat === 'json' || resourceFormat === 'xml')){
      console.error("Invalid data passed to the validator.");
    }
    this.isValidResource = true;
    this.hasResponseData = false;
    this.serverErrorList = [];
    this.serverErrorStatus = '';
    this.serverErrorDetected = false;
    this.serverTimoutDetected = false;
    this.severityLevelsFormControl.patchValue(this.severityLevels);

    this.validationErrorStr = this.fhirValidatorService.getUiValidationMessages(fhirResource, resourceFormat);
    if(this.validationErrorStr){
      //see if we can find any obvious issues with the resource here
      this.isValidResource = false;
      this.validationFinished = true;
      this.fhirValidatorService.setValidationResults({hasBasicErrors: true, isValid: false})
    }
    else {
      // The UI validation passed successfully, and we execute the backend validation.
      this.executeAPIValidation(fhirResource, resourceFormat);
    }
  }

  onPasteFhirResource(event: ClipboardEvent) {
    this.fileName = '';
    this.fhirValidatorService.setResourcePasted(true);
    if(!this.fhirResource) {
      this.clearUI();
    }
    let text = event.clipboardData.getData('text');
    if (this.fhirValidatorService.isJson(text)) {
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

  /*
  * Parsing the response text to render properly in the validation report.
  * Extract each severity level and add styling to it.
  * Sanitize the html so it can be properly rendered in the UI by the framework.
   */
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

    // Reset values to default state prior to validation.
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

    this.validatorSubscription$ = this.fhirValidatorService.validateFhirResource(fhirResource, resourceFormat)
      .subscribe({
      next: (response) => {
        this.validationFinished = true;
        let issues = response.issues;
        if(issues.length === 1 && issues[0].severity === "Information" && issues[0]?.message.toLowerCase() === "ALL OK".toLowerCase()){
          this.isValidResource = true;
          this.fhirValidatorService.setValidationResults({isValid: true})
        }
        else {
          this.isValidResource = false;
          this.validationErrorStr = "Please see the validation errors below.";
          this.setValidatorResponse(response);
        }

        // Some strings produced by the validator are long and miss spaces. This could break the UI validation report.
        // Therefore, we insert a space after each coma found in the validation response text.
        issues.forEach((element: any) => element.message = element.message.replace(/,(?=[^\s])/g, ", "));

        // sort by line numbers
        issues = issues.sort((a: any, b: any) => {
          return this.getLineNumberFromLocation(a.location) - this.getLineNumberFromLocation(b.location);
        });

        // mat each item of the response to an object and make sure that the results are in expanded state in the
        // UI validation report.
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

    //TODO make sure to remove this function when the server side timeout is implemented.
    setTimeout(
      () => {
        if(this.isLoading) {
          this.validatorSubscription$.unsubscribe();
          this.isLoading = false;
          this.serverTimoutDetected = true;
        }
      }, this.SERVER_TIMEOUT_INTERVAL
    );

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
    /*
    * When all elements are collapsed we want to change the expansion icon to render "expand all"
    * When all elements are expanded we want to change the expansion icon to "collapse all"
    * This will save extra unnecessary click for the user
    */
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

  onFhirRecordChanged(fhirResource: any) {
    if(this.fhirValidatorService.isJson(fhirResource)){
      this.fhirValidatorService.setFhirResource(JSON.parse(fhirResource));
    }
    else {
      this.fhirValidatorService.setFhirResource(fhirResource);
    }

  }

  private setValidatorResponse(apiResponse: any) {
    const errorsCount = apiResponse.issues.filter((element: any) => element.severity == 'Error')?.length || 0;
    const warningsCount = apiResponse.issues.filter((element: any) => element.severity == 'Warning')?.length || 0;
    const infoCount = apiResponse.issues.filter((element: any) => element.severity == 'Information')?.length || 0;
    const notesCount = apiResponse.issues.filter((element: any) => element.severity == 'Note')?.length || 0;

    let validationResult: ValidationResults = {};
    validationResult.errorsCount = errorsCount;
    validationResult.warningsCount = warningsCount;
    validationResult.notesCount = notesCount;
    validationResult.infoCount = infoCount;

    if(errorsCount > 0){
      validationResult.isValid = false;
    }
    else {
      validationResult.isValid = true;
    }
    this.fhirValidatorService.setValidationResults(validationResult);
  }

  clearValidationErrors(){
    this.validationErrorStr = '';
    this.isValidResource = false;
    this.parsedFhirResource = null;
    this.hasResponseData = false;
    this.validationFinished = false;
    this.isLoading = false;
    this.serverErrorDetected = false;
    this.serverErrorList = [];
    this.serverErrorStatus = '';
    this.serverTimoutDetected = false;
    this.fhirValidatorService.setValidationResults({});
  }
}
