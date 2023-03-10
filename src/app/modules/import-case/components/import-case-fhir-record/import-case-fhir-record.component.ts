import {Component, OnInit, ViewChild} from '@angular/core';
import {ImportCaseService} from "../../services/import-case.service";
import {UtilsService} from "../../../../service/utils.service";
import {FhirValidatorComponent} from "../../../fhir-validator/components/fhir-validator/fhir-validator.component";
import {FhirValidatorService} from "../../../fhir-validator/services/fhir-validator.service";
import {Observable} from "rxjs";
import {ValidationResults} from "../../../fhir-validator/domain/ValidationResults";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {openConformationDialog} from "../../../../components/widgets/conformation-dialog/conformation-dialog.component";
import {FhirValidatorStateService} from "../../../fhir-validator/service/fhir-validator-state.service";

@Component({
  selector: 'app-import-case-fhir-record',
  templateUrl: './import-case-fhir-record.component.html',
  styleUrls: ['./import-case-fhir-record.component.scss']
})
export class ImportCaseFhirRecordComponent implements OnInit{

  @ViewChild(FhirValidatorComponent) validator: FhirValidatorComponent;

  isLoading: boolean = false;
  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  fileContent: string;
  errorMessage: string;
  fhirValidatorFinished: boolean = false;
  isValidResource: boolean = false;
  validationResult$: Observable<ValidationResults>;
  fhirResource: any;
  preconditionError: string = '';
  invalidResourceFound = false;

  constructor(private importCaseService: ImportCaseService,
              private utilsService: UtilsService,
              private fhirValidatorService: FhirValidatorService,
              private fhirValidatorStateService: FhirValidatorStateService,
              private dialog: MatDialog) { }

  onFileSelected(event: any) {
    this.validator.clearUI();

    this.file = event.target.files[0];

    if(!this.file){
      this.utilsService.showErrorMessage("Unable to open the file.");
    }
    else if (this.file.size > this.MAX_FILE_SIZE){
      console.error("File too big")
      this.utilsService.showErrorMessage("This file exceeds " + this.MAX_FILE_SIZE /  1000 + "kb and cannot be processed");
      this.errorMessage = '';
    }
    else {

      const reader = new FileReader();
      reader.readAsText(this.file, "UTF-8");
      reader.onload = () => {
        this.fileContent = reader.result as string;
        this.fhirValidatorStateService.setFhirResource(this.fileContent);
      }
      reader.onerror = () => {
        this.utilsService.showErrorMessage("Unable to open the file.");
      }
    }

  }

  importCase(){
    this.isLoading = true;
    this.importCaseService.importResource(this.fhirResource).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage("The resource was imported successfully.");
        this.clearUI();
        this.isLoading = false;
      },
      error: err => {
        this.utilsService.showErrorMessage("A server error occurred while importing the resource.")
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  clearUI() {
    // TODO reset the UI to it's initial state.
    this.errorMessage = '';
    this.invalidResourceFound = false;
    this.fileContent = null;
    this.fhirResource = null;
    this.preconditionError = '';
    this.validator.clearUI();
    this.file = null;
  }

  onSubmit() {
    this.validator.clearValidationErrors();
    this.fhirValidatorFinished = false;
    this.isValidResource = false;
    this.errorMessage = '';
    this.isLoading = true;
    this.preconditionError = this.getValidationPreconditionErrors(this.fhirResource);

    const preconditionErrors = this.getValidationPreconditionErrors(this.fhirResource);
    if(!preconditionErrors){
      this.validator.validateFhirResource();
    }
    else{
      this.isLoading = false;
    }
    this.validationResult$.subscribe({
      next: value => {
        this.isLoading = false;
        if (value.isValid) {
          this.importCase();
        } else if(Object.keys(value).length){
          console.warn(this.invalidResourceFound);
          this.invalidResourceFound = true;
        }
      }
    });
  }

  ngOnInit(): void {
    this.validationResult$ = this.fhirValidatorStateService.getValidationResults();

    this.fhirValidatorStateService.getFhirResource().subscribe({
      next: value => {
        this.preconditionError = '';
        if(this.utilsService.isJsonString(value)){
          this.fhirResource = JSON.parse(value);
        }
        else {
          this.fhirResource = value;
        }
        this.invalidResourceFound = false;
      }
    });

    this.fhirValidatorStateService.isResourcePasted().subscribe({
      next: value => {
        if(value){
          this.file = null;
          this.invalidResourceFound = false;
        }
      }
    })
  }

  private getValidationPreconditionErrors(resource: any): string {
    if(!resource){
      const error = ("Please upload or paste a resource.");
      console.error(error);
      return error;
    }
    else if(!this.fhirValidatorService.isJson(resource)){
      const error = ("The resource is not a valid json.");
      console.error(error);
      console.log(resource);
      return error;
    }
    else if(resource.resourceType !== "Bundle"){
      const error = ("Resource type must be Bundle.");
      console.error(error);
      return error;
    }
    else if(!resource.meta?.profile?.[0] || resource.meta.profile[0] !== "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"){
      const error = ("Invalid MDI.");
      console.error(error);
      return error;
    }
    else return null
  }

  onSubmitInvalidRecord() {
    openConformationDialog(
      this.dialog,
      {
        title: "Import Invalid Resource",
        content: "Invalid records may behave unexpectedly. Do you want to proceed?",
        primaryActionBtnTitle: "Submit",
        secondaryActionBtnTitle: "Cancel",
        width: "25em",
        height: "15em",
        isPrimaryButtonLeft: true
      })
      .subscribe(
        action => {
          if (action == 'primaryAction') {
            this.importCase();
          }
          else if(action == 'secondaryAction'){
            console.log('secondary selected');
          }
        }
      );
  }
}
