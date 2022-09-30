import {Component, OnInit, ViewChild} from '@angular/core';
import {ImportCaseService} from "../../../../service/import-case.service";
import {UtilsService} from "../../../../service/utils.service";
import {FhirValidatorComponent} from "../../../../fhir-validator/components/fhir-validator/fhir-validator.component";
import {FhirValidatorService} from "../../../../fhir-validator/service/fhir-validator.service";
import {combineLatestWith, Observable} from "rxjs";
import {ValidationResults} from "../../../../fhir-validator/domain/ValidationResoults";

@Component({
  selector: 'app-import-case-fhir-record',
  templateUrl: './import-case-fhir-record.component.html',
  styleUrls: ['./import-case-fhir-record.component.css']
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
  validationExecuted$: Observable<boolean>;
  validationResult$: Observable<ValidationResults>;
  fhirResource: any;
  preconditionError: string = '';

  constructor(private importCaseService: ImportCaseService,
              private utilsService: UtilsService,
              private fhirValidatorService: FhirValidatorService) { }

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
        this.fhirValidatorService.setFhirResource(this.fileContent);
      }
      reader.onerror = () => {
        this.utilsService.showErrorMessage("Unable to open the file.");
      }
    }

  }

  clearUI() {
    // TODO reset the UI to it's initial state.
    this.errorMessage = '';
  }

  onSubmit() {
    this.fhirValidatorFinished = false;
    this.isValidResource = false;
    this.errorMessage = '';

    this.preconditionError = this.getValidationPreconditionErrors(this.fhirResource);

    this.getValidationPreconditionErrors(this.fhirResource);
    //this.validator.validateFhirResource();

    this.importCaseService.importResource(this.fhirResource).subscribe({
      next: value => console.log(value),
      error: err => console.error(err)
    });

    this.validationExecuted$.pipe(
      combineLatestWith(this.validationResult$)
    ).subscribe(([executed, validationResults]) => {
      console.log(validationResults);
      if(executed && validationResults){
        //
        console.log("Valid resource found, submit to backend.")
      }
    });
  }

  ngOnInit(): void {
    this.validationExecuted$ = this.fhirValidatorService.isValidationExecuted();
    this.validationResult$ = this.fhirValidatorService.getValidationResults();
    this.fhirValidatorService.getFhirResource().subscribe({
      next: value => {
        this.preconditionError = '';
        console.log(value);
        this.fhirResource = value;
      }
    })
  }

  private getValidationPreconditionErrors(resource: any): string {
    if(!resource){
      const error = ("Please upload or paste a resource.");
      console.error(error);
      return error;
    }
    else if(resource.resourceType !== "Bundle"){
      const error = ("Resource type must be Bundle.");
      console.error(error);
      return error;
    }
    else if(resource.meta.profile[0] !== "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"){
      const error = ("Resource type must be Bundle.");
      console.error(error);
      return error;
    }
    else return null
  }
}
