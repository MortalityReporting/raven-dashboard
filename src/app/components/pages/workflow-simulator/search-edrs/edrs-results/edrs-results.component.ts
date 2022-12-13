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

  searchParams = [
    { display: 'Decedent Last Name', value:  'patient.family' },
    { display: 'Decedent First Name', value: 'patient.given'},
    { display: 'Legal Sex at Death', value: 'patient.gender'},
    { display: 'Date of Birth', value: 'patient.birthday'},
  ];

  get parameters() {
    return this.searchEdrsForm.controls["parameters"] as FormArray;
  }

  addNewFilter(){
    const paramsFormGroup = this.fb.group({
      name: new FormControl(''),
      valueString: new FormControl(''),
    });
    this.parameters.push(paramsFormGroup);
  }

  searchEdrsForm = this.fb.group({
    parameters: this.fb.array([])
  })

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

    this.setInitialFilterControls();

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
          .map(param => { return { display: this.toTitleCase(this.removePeriods(param)), value: param } });

        this.searchParams = this.searchParams.concat(dataDrivenParams);
        this.searchParams = this.searchParams.filter((item,index)=>{
          return (this.searchParams.indexOf(item) == index)
        })
        console.log(this.searchParams);
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage()
      }
    });
  }

  onSelectDifferentDocument() {
    this.parentStepper.reset();
  }

  onChangeEndpointConfiguration() {
    this.parentStepper.previous();
  }

  onSubmitSearchParams() {

  }

  getSearchParametersResourcePreview() {
    const formParams = this.searchEdrsForm.value.parameters.filter(param => !!param.valueString);
    let result: any = null;
    if(formParams){
      result = {
        resourceType: "Parameters",
        parameter: []
      }
      formParams.forEach(param => {
        if(param.name.indexOf('.') !=-1){
          let periodSeparated = param.name.split('.');
          let part = [];
          const name = periodSeparated[0];
          const value = periodSeparated[1];
          result.parameter.push({name: name, part: []});
          this.getParts(name, formParams);
          //
          // console.log(result);
          // console.log(periodSeparated);
        }
      })
    }

    return this.searchEdrsForm.value.parameters.filter(param => !!param.valueString);
  }

  onResultsTabChange() {
    console.log("onResultsTabChange");
  }

  getFilterTypes(index, paramsFormControl) {
    const currentParams = this.parameters.value.map(value => value.name);
    const result = this.searchParams
      .filter(param => (currentParams.indexOf(param.value) == -1) || param.value == paramsFormControl.value.name)
    // TODO do we need those params to be sorted in any way?
    // Below is a simple alphabetical sort
    //   .sort(function(a,b) {
    //     let c = a.display.toLowerCase();
    //     let d = b.display.toLowerCase();
    //     if (c == d) return 0;
    //     if (c > d) return 1;
    //     return -1;
    //   });
    return result;
  }

  onDeleteFilter(filterIndex){
    this.parameters.removeAt(filterIndex);
  }


  onSubmit() {
    //console.log(this.filtersFormGroup)
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

  setInitialFilterControls(){
    // TODO: We should refactor this and use a loop. The code is too repetitive.
    const  givenNameFg = this.fb.group({
      name : new FormControl('patient.given'),
      valueString: new FormControl(''),
    });
    this.parameters.push(givenNameFg);

    const lastNameFg = this.fb.group({
      name : new FormControl('patient.family'),
      valueString: new FormControl(''),
    });
    this.parameters.push(lastNameFg);

    const dobFg = this.fb.group({
      name : new FormControl('mdi-case-number'),
      valueString: new FormControl(''),
    });
    this.parameters.push(dobFg);

  }

  getQueryParams() {
    // const params = this.getSearchParametersResourcePreview();
    // console.log(params);
  }

  private getParts(name: any, formParams: any) {
    let result = null;
    console.log(name);
    console.log(formParams);
    //name =
    return null;
  }
}


