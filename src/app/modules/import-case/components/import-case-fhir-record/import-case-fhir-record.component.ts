import {Component, Inject, ViewChild} from '@angular/core';
import {ImportCaseService} from "../../services/import-case.service";
import {UtilsService} from "../../../../service/utils.service";
import {FhirValidatorComponent} from "../../../fhir-validator/components/fhir-validator/fhir-validator.component";
import {MatDialog} from "@angular/material/dialog";
import {openConfirmationDialog} from "ngx-hisb-common-ui";
import {ImplementationGuide, NgxFhirValidatorComponent, ValidationResults} from "ngx-fhir-validator";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FhirValidatorResultsExportService} from "../../../../service/fhir-validator-results-export.service";


@Component({
    selector: 'app-import-case-fhir-record',
    templateUrl: './import-case-fhir-record.component.html',
    styleUrls: ['./import-case-fhir-record.component.scss'],
    standalone: false
})
export class ImportCaseFhirRecordComponent {

  @ViewChild(FhirValidatorComponent) validator: FhirValidatorComponent;
  @ViewChild(NgxFhirValidatorComponent) fhirValidator

  isLoading: boolean = false;
  fhirResource: any;
  validationExecuted: boolean = false;
  preconditionError: string;

  ig: ImplementationGuide = {
    canonicalUrl:'hl7.fhir.us.mdi#current',
    name: "hl7.fhir.us.mdi",
    version: "current"
  };

  constructor(
    @Inject('importConfig') public config: ModuleHeaderConfig,
    private importCaseService: ImportCaseService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private fhirValidatorResultsExportService: FhirValidatorResultsExportService) {
  }

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

  onExportValidationResults(event: any){
    this.fhirValidatorResultsExportService.exportToPdf(event.jsonResource, event.resultsData);
  }

  onImportRecord() {
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
            //console.log('secondary selected');
          }
        }
      );
  }

  onValidation(event: ValidationResults) {
    this.validationExecuted = true;
    this.fhirResource = event.resource;
  }

  onValidationError(event: any) {
    this.validationExecuted = true;
  }

  onValidate() {
    this.fhirValidator.validateFhirResource();
  }

  onResourceContentChanged(event: any) {
    this.validationExecuted = false;
  }
}
