import { Component, OnInit } from '@angular/core';
import {openInputTextDialog} from "../../../../../../components/widgets/input-text-dialog/input-text-dialog.component";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {UtilsService} from "../../../../../../service/utils.service";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {Validators} from "@angular/forms";
import {JsonValidator} from "../../../../../../reactive-form-validators/json-validator";
import {ResourceTypeValidator} from "../../../../../../reactive-form-validators/resource-type-validator";
import {DecedentSimpleInfo} from "../../../../../../model/decedent-simple-info";
import {UiStringConstants} from "../../../../../../providers/ui-string-constants";
import {FhirHelperService, PatientNameReturn} from "../../../../../../modules/fhir-util/services/fhir-helper.service";

@Component({
  selector: 'app-import-mdi-to-edrs-document',
  templateUrl: './import-mdi-to-edrs-document.component.html',
  styleUrls: ['./import-mdi-to-edrs-document.component.scss']
})
export class ImportMdiToEdrsDocumentComponent implements OnInit {

  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  fileContent: any;
  errorMessage: string;
  decedentData: DecedentSimpleInfo;
  uiConstantsStep1: any;
  commonUIConstants: any

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private searchEdrsService: SearchEdrsService,
    private uiStringConstants: UiStringConstants,
    private fhirHelperService: FhirHelperService
  ) {
    this.uiConstantsStep1 = uiStringConstants.WorkflowSimulator.searchEdrs.step1;
    this.commonUIConstants = uiStringConstants.Common;
  }

  ngOnInit(): void {
    this.searchEdrsService.documentBundle$.subscribe({
      next: documentBundleValue => {
        if(documentBundleValue && documentBundleValue?.resourceType === "Bundle"){
          this.decedentData = this.getPatientData(documentBundleValue);
        }
        else {
          this.decedentData = null;
        }
        this.searchEdrsService.setDecedentData(this.decedentData);
      }
    })
  }

  onInputMdiToEdrsBundle() {
    this.file = null;
    this.errorMessage = null;
    openInputTextDialog(
      this.dialog,
      {
        title: "Input MDI to EDRS Document Bundle ",
        primaryActionBtnTitle: "Save",
        secondaryActionBtnTitle: "Cancel",
        isPrimaryButtonLeft: false,
        formValidators:[Validators.required, JsonValidator, ResourceTypeValidator],
        formValidationTypes: [
          { name: 'required', display:"Enter or paste content." },
          { name: "jsonValidator", display: "The content should be valid json" },
          { name: "resourceTypeValidator", display: "Resource Type not found." },
        ]
      })
      .subscribe(
        data => {
          const bundle = JSON.parse(data);
          this.searchEdrsService.setDocumentBundle(bundle);
        }
      );
  }

  onFileSelected(event: any) {
    this.errorMessage = '';

    this.file = event.target.files[0];

    if(!this.file){
      this.errorMessage = "Unable to open the file.";
      console.error(this.errorMessage);
    }
    else if (this.file.size > this.MAX_FILE_SIZE){
      this.errorMessage = "This file exceeds " + this.MAX_FILE_SIZE /  1000 + "kb and cannot be processed";
      console.error(this.errorMessage);
    }
    else {
      const reader = new FileReader();
      reader.readAsText(this.file, "UTF-8");
      reader.onload = () => {
        try {
          this.fileContent = JSON.parse(reader.result as string);
          this.errorMessage = this.validateFileContent(this.fileContent);
          if(!this.errorMessage) {
            this.searchEdrsService.setDocumentBundle(this.fileContent);
          }
        }
        catch (e) {
          console.error(e);
          this.errorMessage = "Parsing Error. Unable to open the file.";
        }
      }
      reader.onerror = () => {
        this.errorMessage = "Parsing Error. Unable to open the file.";
        console.error(this.errorMessage);
      }
    }
  }

  private validateFileContent(fileContent: any): string {
    if (!fileContent){
      return "The file is empty or not parsed correctly";
    }
    if (this.utilsService.isJsonString(fileContent)){
      return "Invalid JSON content detected";
    }
    if (!fileContent.resourceType){
      return 'Invalid resource detected. Missing "Resource Type" property';
    }
    if (fileContent.resourceType != "Bundle"){
      return 'Invalid resource detected. The resource type must be Bundle';
    }
    return null;
  }

  private getPatientData(documentBundle: any): DecedentSimpleInfo {
    let decedentSimpleInfo: DecedentSimpleInfo = { name: '', dateTimeOfDeath: '', mdiTrackingNumber: '', patientResource: null };

    const patient = documentBundle.entry.find(entry => entry.resource?.resourceType === "Patient");
    if(patient){
      const name = this.getPatientName(patient?.resource);
      decedentSimpleInfo.name = name;
      decedentSimpleInfo.patientResource = patient?.resource;
    }

    const composition = documentBundle.entry.find(entry => entry.resource?.resourceType === "Composition");
    if(composition){
      const caseNumber = composition?.resource?.extension?.[0]?.valueIdentifier?.value;
      decedentSimpleInfo.mdiTrackingNumber = caseNumber;
    }

    const dateTimeOfDeathObservation = this.getObservationByCode(documentBundle, "81956-5");
    if(dateTimeOfDeathObservation){
      const dateTimeOfDeath = dateTimeOfDeathObservation?.effectiveDateTime;
      decedentSimpleInfo.dateTimeOfDeath = dateTimeOfDeath;
    }

    return decedentSimpleInfo;
  }

  getObservationByCode(documentBundle, code){
    if(!documentBundle || !code){
      console.warn("Invalid parameters passed");
      return null;
    }
    const observation = documentBundle.entry
      .find(entry => entry.resource?.resourceType === "Observation" && entry.resource?.code?.coding?.[0]?.code === code)?.resource;
    return observation;
  }

  private getPatientName(patientResource: any): string {
    if(!patientResource || !(patientResource?.resourceType === "Patient")){
      console.warn("Invalid resource passed");
      return null;
    }
    const name = this.fhirHelperService.getPatientOfficialName(patientResource, PatientNameReturn.lastfirst);

    return name;
  }
}
