import {Component, Input, OnInit} from '@angular/core';
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../../../service/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {UtilsService} from "../../../../../service/utils.service";

@Component({
  selector: 'app-edrs-results',
  templateUrl: './edrs-results.component.html',
  styleUrls: ['./edrs-results.component.css']
})
export class EdrsResultsComponent implements OnInit {
  @Input('parentStepper') parentStepper: MatStepper;
  decedentInfo: DecedentSimpleInfo;

  uiConstantsStep3: any;
  commonUIConstants: any;

  initialFilters = [
    { display: 'Decedent Last Name', value:  'patient.family' },
    { display: 'Decedent First Name', value: 'patient.given'},
    { display: 'Legal Sex at Death', value: 'patient.gender'},
    { display: 'Date of Birth', value: 'patient.birthday'},
  ];

  filtersForm = this.fb.group({
    name: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
  });

  get filters() {
    return this.companyForm.controls["filters"] as FormArray;
  }

  addNewFilter(){
    this.filters.push(this.filtersForm);
  }

  companyForm = this.fb.group({
    companyName: new FormControl('', [Validators.required]),
    filters: this.fb.array([])
  })

  edrsSearchParametersForm = this.fb.group({
    decedentFirstName: [],
    decedentLastName: [],
    legalSexAtDeath: [],
    dob: []
  });

  testForm = this.fb.group({
    filter: [],
  });

  constructor(
    private searchEdrsService: SearchEdrsService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    uiStringConstants: UiStringConstants
  ) {
    this.uiConstantsStep3 = uiStringConstants.WorkflowSimulator.searchEdrs.step2;
    this.commonUIConstants = uiStringConstants.Common;
  }
  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });

    this.searchEdrsService.getOperationDefinitionList().subscribe({
      next: value => {
        console.log(value);
        const dataDrivenParams = value.parameter
          .filter(param => param.type === 'string')
          .map(param => param.name)
          .map(param => { return { display: this.toTitleCase(this.removePeriods(param)), value: param } })
        // this.operationDefinitionParameters.push(...dataDrivenParams);
        // console.log(this.operationDefinitionParameters);
        console.log(dataDrivenParams);
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage()
      }
    });
  }

  onAddControl(name){
    this.testForm.addControl('new', new FormControl('', Validators.required));
  }

  onSelectDifferentDocument() {
    this.parentStepper.reset();
  }

  onChangeEndpointConfiguration() {
    this.parentStepper.previous();
  }

  onSubmitSearchParams() {
    console.log(this.edrsSearchParametersForm.value);
  }

  getSearchParametersResourcePreview() {
    return this.edrsSearchParametersForm.value;
  }

  onResultsTabChange() {
    console.log("onResultsTabChange");
  }

  // Helper Functions

  removePeriods(str: string): string{
    return str.replace(/-/g, ' ').replace(/_/g, ' ')+'';
  }

  toTitleCase(str: string): string{
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

}
