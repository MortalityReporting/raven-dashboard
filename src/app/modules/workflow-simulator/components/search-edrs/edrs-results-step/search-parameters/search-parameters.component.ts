import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormControl, FormGroup} from "@angular/forms";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {UtilsService} from "../../../../../../service/utils.service";
import {Obs_DeathDate, Obs_MannerOfDeath} from "../../../../../../model/mdi/profile.list";
import {TrackingNumberType} from "../../../../../../model/tracking.number.type";
import {FhirHelperService, PatientNameReturn} from "../../../../../../modules/fhir-util/services/fhir-helper.service";
import {DecedentSimpleInfo} from "../../../../../../model/decedent-simple-info";
import {blueJay} from "../../../../../../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-search-parameters',
  templateUrl: './search-parameters.component.html',
  styleUrls: ['./search-parameters.component.scss']
})
export class SearchParametersComponent implements OnInit {

  @Output() searchResultsEmitter : EventEmitter<any> = new EventEmitter();
  @Output() clearSearchResultEmitter : EventEmitter<any> = new EventEmitter();

  operationsDatsStructure: any;
  resultTableDataSource = new MatTableDataSource<any>();
  decedentInfo: DecedentSimpleInfo;

  edrsSearchFormParams: any = [];

  searchEdrsForm = this.fb.group({
    parameters: this.fb.array([])
  });

  errorMessage: string;

  constructor(
    private fb: UntypedFormBuilder,
    private searchEdrsService: SearchEdrsService,
    private utilsService: UtilsService,
    private fhirHelperService: FhirHelperService,
  ) {
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
        // We need to flatten the data structure and for all parameters having parts,wee add tha name of the parameter
        // value of the name. For example if the part has a name "patient" and the inner part has name "birthdate",
        // the result we produce is "patient.birthdate". The reason we need the flat structure is to accommodate the
        // searchEdrsForm dynamic fields.

        const paramPart = value.parameter
          .filter(param => !!param.part)
          .map(param =>
            param.part.map(innerParam => {innerParam.name = param.name + '.' + innerParam.name; return innerParam})
          )
          .flat()
          .map(param => { return { display: this.getDisplayValueFromExtension(param), value: param.name } })
          .filter(param => !!param.display && !!param.value);

        const simpleParams = value.parameter
          .filter(param => param.type === 'string')
          .map(param => { return { display: this.getDisplayValueFromExtension(param), value: param.name } })
          .filter(param => !!param.display && !!param.value);
        this.edrsSearchFormParams = paramPart.concat(paramPart);
        this.edrsSearchFormParams = this.edrsSearchFormParams.concat(simpleParams);
        this.edrsSearchFormParams = this.edrsSearchFormParams.filter((item, index)=>{
          return (this.edrsSearchFormParams.indexOf(item) == index)
        });

        this.searchEdrsService.decedentData$.subscribe({
          next: value => this.patchInitialDecedentDataToEDRSForm(value)
        });
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
      }
    });
  }

  get parameters() {
    return this.searchEdrsForm.controls["parameters"] as UntypedFormArray;
  }

  onSubmit() {
    this.errorMessage = '';
    if(this.atLestOneParamSelected()){
      this.executeEdrsSearch();
    }
    else {
      this.errorMessage = "You must enter data for at least one parameter."
    }
  }

  atLestOneParamSelected(){
    const result = !!this.searchEdrsForm?.value?.parameters?.find(parameter => !!parameter?.valueString);
    return result;
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

  addNewFilter(){
    const paramsFormGroup = this.fb.group({
      name: new UntypedFormControl(''),
      valueString: new UntypedFormControl(''),
    });
    this.parameters.push(paramsFormGroup);
  }

  getSearchParametersResourcePreview() {
    const formParams = this.searchEdrsForm.value.parameters.filter(param => !!param.valueString);

    const result = {
      resourceType: "Parameters",
      parameter: this.getParameters(formParams)
    }
    return result;
  }

  private executeEdrsSearch() {
    this.clearSearchResultEmitter.emit();
    this.searchEdrsService.searchEdrs(blueJay.serverBase, this.getSearchParametersResourcePreview()).subscribe({
      next: value => {
        this.searchResultsEmitter.emit({ response: value, success: true });
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage();
        this.searchResultsEmitter.emit({ response: err, success: false });
      }
    });
  }

  private setInitialFormControls(){
    // TODO: We should refactor this and use a loop. The code is too repetitive.
    // Also the API we use does not support sort order so the order we use must be hardcoded somewhere,
    // until the API is changed
    this.errorMessage = '';
    const  givenNameFg = this.fb.group({
      name : new UntypedFormControl('patient.given'),
      valueString: new UntypedFormControl(''),
    });
    this.parameters.push(givenNameFg);

    const lastNameFg = this.fb.group({
      name : new UntypedFormControl('patient.family'),
      valueString: new UntypedFormControl(''),
    });
    this.parameters.push(lastNameFg);

    const edrsNumber = this.fb.group({
      name : new UntypedFormControl('edrs-file-number'),
      valueString: new UntypedFormControl(''),
    });
    this.parameters.push(edrsNumber);

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
        const result = {name : formParam.name, valueString: formParam.valueString};
        resultList.push(result);
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

  private parseResponseToTable(response: any) {
    const outerEntryList = response.entry;
    let formattedData = [];
    outerEntryList.forEach((bundle, i) => {
      let decedent: any = {};
      decedent.bundleResource = bundle;

      const patientResource = this.getPatientResource(bundle.resource);
      const officialName = this.fhirHelperService.getPatientOfficialName(patientResource);
      decedent.officialName = officialName;

      const mannerOfDeathObservation = this.getObservationByProfile(bundle.resource, Obs_MannerOfDeath);
      const mannerOfDeathStr = this.getMannerOfDeathObservationStr(mannerOfDeathObservation);
      decedent.mannerOfDeath = mannerOfDeathStr;

      const deathDateObservation = this.getObservationByProfile(bundle.resource, Obs_DeathDate);
      decedent.deathDate= deathDateObservation.effectiveDateTime;

      const mdiCaseNumber = this.getTrackingNumber(bundle.resource, TrackingNumberType.Mdi);
      decedent.mdiCaseNumber = mdiCaseNumber;

      const edrsFileNumber = this.getTrackingNumber(bundle.resource, TrackingNumberType.Edrs);
      decedent.edrsFileNumber = edrsFileNumber;

      formattedData.push(decedent);
    })
    console.log(formattedData);
    this.resultTableDataSource.data = formattedData;
  }

  // TODO extract this to mdi services
  private getMannerOfDeathObservationStr(observationResource){
    if(!observationResource.resourceType
      || observationResource.resourceType != 'Observation'){
      console.warn("Empty or incorrect function parameter.");
      return null;
    }
    const result = observationResource.valueCodeableConcept?.coding?.[0]?.display;
    return result;
  };

  private getPatientResource(documentBundle) {
    if(!documentBundle
      || !documentBundle.resourceType || documentBundle.resourceType != "Bundle"
      || !documentBundle.type || documentBundle.type != "document"
      || !documentBundle.entry?.length){
      console.warn("Empty or incorrect function parameter.");
      return null;
    }
    const result = documentBundle.entry
      .find(entry => entry?.resource?.resourceType === "Patient")
      .resource;
    return result;
  }

  private getObservationByProfile(documentBundle, profileStr) {
    if(!documentBundle
      || !documentBundle.resourceType || documentBundle.resourceType != "Bundle"
      || !documentBundle.type || documentBundle.type != "document"
      || !documentBundle.entry?.length){
      console.warn("Empty or incorrect function parameter.");
      return null;
    }
    const result = documentBundle.entry
      .filter(entry => entry?.resource?.resourceType === "Observation")
      .find(entry => entry?.resource?.meta?.profile?.[0] === profileStr)
      .resource;

    return result;
  }

  private removePeriods(str: string): string{
    return str.replace(/-/g, ' ').replace(/_/g, ' ')+'';
  }


  getTrackingNumber(resource: any, type: TrackingNumberType = TrackingNumberType.Mdi): string {
    const extensions = resource.extension;
    const trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    const matchedExtension = trackingNumberExtensions?.find((extension: any) => extension?.valueIdentifier?.type?.coding?.[0].code === type);
    return matchedExtension?.valueIdentifier?.value || undefined;
  }

  onClearSearch() {
    // This here is a bit extreme, since it effectively recreates the form and we should refactor it whe we obtain ALL
    // parameters in the order we want from the API.
    this.searchEdrsForm = this.fb.group({
      parameters: this.fb.array([])
    });

    this.setInitialFormControls();
    this.clearSearchResultEmitter.emit();
  }

  private getDisplayValueFromExtension(param): string {
    const result = param.extension?.find(extension => extension.url === "urn:gtri:mapi-label" )?.valueString;
    return result;
  }

  private patchInitialDecedentDataToEDRSForm(decedentData){
    if(decedentData?.patientResource){
      //TODO we need to come up with a data driven solution for this. Using hardcoded array indexing is a bad idea
      const decedentFirstName = this.fhirHelperService.getPatientOfficialName(decedentData.patientResource, PatientNameReturn.firstonly);
      const givenNameFormControl =  (<UntypedFormArray>this.searchEdrsForm.controls['parameters']).at(0);
      givenNameFormControl.patchValue({name : "patient.given", valueString: decedentFirstName});

      const decedentLastName = this.fhirHelperService.getPatientOfficialName(decedentData.patientResource, PatientNameReturn.lastonly);
      const lastNameFormControl =  (<UntypedFormArray>this.searchEdrsForm.controls['parameters']).at(1);
      lastNameFormControl.patchValue({name : "patient.family", valueString: decedentLastName});
    }
  }
}
