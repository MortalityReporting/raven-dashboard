import {Component, OnInit, ViewChild} from '@angular/core';
import {ImportCaseService} from "../../services/import-case.service";
import {UtilsService} from "../../../../service/utils.service";
import {FhirValidatorComponent} from "../../../fhir-validator/components/fhir-validator/fhir-validator.component";
import {MatDialog} from "@angular/material/dialog";
import {openConfirmationDialog} from "common-ui";
import {NgxFhirValidatorComponent, ValidationResults} from "ngx-fhir-validator";

@Component({
  selector: 'app-import-case-fhir-record',
  templateUrl: './import-case-fhir-record.component.html',
  styleUrls: ['./import-case-fhir-record.component.scss']
})
export class ImportCaseFhirRecordComponent implements OnInit{

  @ViewChild(FhirValidatorComponent) validator: FhirValidatorComponent;
  @ViewChild(NgxFhirValidatorComponent) fhirValidator

  isLoading: boolean = false;
  fhirResource: any;
  invalidResourceFound: boolean = false;
  preconditionError: string;
  constructor(private importCaseService: ImportCaseService,
              private utilsService: UtilsService,
              private dialog: MatDialog) { }

  importCase(){
    this.isLoading = true;
    this.importCaseService.importResource(this.fhirResource).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage("The resource was imported successfully.");
        this.isLoading = false;
      },
      error: err => {
        this.utilsService.showErrorMessage("A server error occurred while importing the resource.")
        console.error(err);
        this.isLoading = false;
      }
    });
  }



  ngOnInit(): void {
  }

  onSubmitInvalidRecord() {
    openConfirmationDialog(
      this.dialog,
      {
        title: "Import Invalid Resource",
        content: "Invalid records may behave unexpectedly. Do you want to proceed?",
        primaryActionBtnTitle: "Submit",
        secondaryActionBtnTitle: "Cancel",
        width: "25em",
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

  onValidation(event: ValidationResults) {
    this.invalidResourceFound = !event.isValid;
    this.fhirResource = event.resource;
    if(event.isValid){
      this.importCase();
    }
  }

  onValidationError(event: any) {
    this.invalidResourceFound = false;
  }

  onSubmit() {
    this.fhirValidator.validateFhirResource();
  }

  onResourceContentChanged(event: any) {
    this.invalidResourceFound = false;
  }
}
