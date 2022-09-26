import {Component, OnInit, ViewChild} from '@angular/core';
import {ImportCaseService} from "../../../service/import-case.service";
import {UtilsService} from "../../../service/utils.service";
import {ValidatorCoreComponent} from "../../../fhir-validator/components/validator-core/validator-core.component";
import {FhirValidatorComponent} from "../../../fhir-validator/components/fhir-validator/fhir-validator.component";
import {FhirValidatorService} from "../../../fhir-validator/service/fhir-validator.service";
import {combineLatestWith, forkJoin, Observable} from "rxjs";
import {combineLatest} from "rxjs-compat/operator/combineLatest";

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
  validResourceFound$: Observable<boolean>

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

    // The user has not entered any content or uploaded a file.
    // if(!this.fileContent){
    //   this.errorMessage = "You must paste content or upload a file.";
    //   return;
    // }
    this.validator.validateFhirResource();

    this.validationExecuted$.pipe(
      combineLatestWith(this.validResourceFound$)
    ).subscribe(([executed, valid]) => {
      if(executed && valid){
        //
        console.log("Valid resource found, submit to backend.")
      }
    });
  }

  ngOnInit(): void {
    this.validationExecuted$ = this.fhirValidatorService.isValidationExecuted();
    this.validResourceFound$=  this.fhirValidatorService.isValidResourceFound();
  }



}
