import {Component, Input, OnInit} from '@angular/core';
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../../../service/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {FormArray, FormBuilder, FormControl} from "@angular/forms";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {UtilsService} from "../../../../../service/utils.service";
import {MatTableDataSource} from "@angular/material/table";
import {FhirHelperService} from "../../../../../service/fhir/fhir-helper.service";

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

  operationsDatsStructure: any;
  errorResponse: any;
  successResponse: any;
  resultTableColumns = ['officialName', 'dateOfDeath', 'mannerOfDeath', 'mdiCaseNumber', 'edrsFileNumber'];
  resultTableDataSource = new MatTableDataSource<any>();

  //TODO change this to a data driven solution when we have an API that can support it
  edrsSearchFormParams = [
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
    uiStringConstants: UiStringConstants,
    private fhirHelperService: FhirHelperService
  ) {
    this.uiConstantsStep3 = uiStringConstants.WorkflowSimulator.searchEdrs.step2;
    this.commonUIConstants = uiStringConstants.Common;
  }

  ngOnInit(): void {

    this.setInitialFormControls();

    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });

    this.searchEdrsService.getOperationDefinitionList().subscribe({
      next: value => {
        this.operationsDatsStructure = value;
        const dataDrivenParams = value.parameter
          .filter(param => param.type === 'string')
          .map(param => param.name)
          .map(param => { return { display: this.toTitleCase(this.removePeriods(param)), value: param } });

        this.edrsSearchFormParams = this.edrsSearchFormParams.concat(dataDrivenParams);
        this.edrsSearchFormParams = this.edrsSearchFormParams.filter((item, index)=>{
          return (this.edrsSearchFormParams.indexOf(item) == index)
        })
        console.log(this.edrsSearchFormParams);
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
      }
    });
  }

  getSearchParametersResourcePreview() {
    const formParams = this.searchEdrsForm.value.parameters.filter(param => !!param.valueString);

    const result = {
      resourceType: "Parameters",
      parameter: this.getParameters(formParams)
    }
    return result;
  }

  private parseResponseToTable(response: any) {
    const outerEntryList = response.entry;
    let formattedData = [];
    outerEntryList.forEach((bundle, i) => {
      let decedent: any = {};
      decedent.bundleResource = bundle;
      bundle.resource.entry.forEach(entry => {
        // console.log(entry);
        // console.log(i);
        if(entry.resource.resourceType === 'Patient'){
          decedent.patientResource = entry.resource;
          const officialName = this.fhirHelperService.getPatientOfficialName(entry.resource);
          decedent.officialName = officialName;
          decedent.mannerOfDeath = 'Accidental';
          decedent.edrsFileNumber = '1234-56-789';
          decedent.mdiCaseNumber = '789';
          decedent.dateOfDeath = new Date();
        }
      });
      formattedData.push(decedent);
    })
    console.log(formattedData);
    this.resultTableDataSource.data = formattedData;
  }

  executeEdrsSearch(){
    this.errorResponse = null;
    this.successResponse = null;
    this.searchEdrsService.searchEdrs(this.getSearchParametersResourcePreview()).subscribe({
      next: value => {
        console.log(value);
        this.parseResponseToTable(value);
        this.successResponse = value;
        },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
        this.errorResponse = err;
      }
    });
  }

  onResultsTabChange() {
    console.log("onResultsTabChange");
  }

  getFormControlParamTypes(index, paramsFormControl) {
    const currentParams = this.parameters.value.map(value => value.name);
    const result = this.edrsSearchFormParams
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

  onDeleteFormParam(filterIndex){
    this.parameters.removeAt(filterIndex);
  }


  onSubmit() {
    this.executeEdrsSearch();
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

  setInitialFormControls(){
    // TODO: We should refactor this and use a loop. The code is too repetitive.
    // Also the API we use does not support sort order so the order we use must be hardcoded somewhere,
    // until the API is changed
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

  private getParameters(formParams: any) {
    // TODO: enhance the parser when we know the final data structure we are using, or we have more complicated data.
    // This is a very simple parser, that should be enhanced.
    // at this moment the data we receive from the backend has noise, and I decided to use a simplified parser,
    // until we know what more about the data structure we are to use. Using the nested recursive structure proposed by
    // FHIR is an overkill for this project. (http://www.hl7.org/fhir/parameters.html)
    let resultList = [];
    formParams.forEach(formParam => {
      if (formParam.name.indexOf('.') == -1) {
        console.log(formParam);
        const result = {name : formParam.name, valueString: formParam.valueString};
        if(resultList.indexOf(result) == -1){
          resultList.push(result);
        }
      }
      else {
        if(resultList.length == 0){
          const name = formParam.name.split('.')[0];
          const part = [{name: formParam.name.split('.')[1], valueString:  formParam.valueString}];
          const result = {name: name, part: part};
          resultList.push(result);
        }
        else {
          const name = formParam.name.split('.')[0];
          if(resultList.find(param => param.name == name)){
            resultList = resultList.map(param => {
              if(param.name == name){
                param.part.push({name: formParam.name.split('.')[1], valueString:  formParam.valueString})
              }
              return param;
            })
          }
        }
      }
    });

    return resultList;
  }


}


