import { Component, OnInit } from '@angular/core';
import {openInputTextDialog} from "../../../widgets/input-text-dialog/input-text-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UtilsService} from "../../../../service/utils.service";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {Validators} from "@angular/forms";
import {JsonValidator} from "../../../../reactive-form-validators/json-validator";
import {ResourceTypeValidator} from "../../../../reactive-form-validators/resource-type-validator";
import {DecedentSimpleInfo} from "../../../../model/decedent-simple-info";

@Component({
  selector: 'app-import-mdi-to-edrs-document',
  templateUrl: './import-mdi-to-edrs-document.component.html',
  styleUrls: ['./import-mdi-to-edrs-document.component.css']
})
export class ImportMdiToEdrsDocumentComponent implements OnInit {

  file: File = null;
  MAX_FILE_SIZE = 100000; // Max allowed file size is 100KB
  fileContent: any;
  errorMessage: string;
  decedentData: DecedentSimpleInfo;

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private searchEdrsService: SearchEdrsService) { }

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
          this.searchEdrsService.setDocumentBundle(data);
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
    if(!fileContent){
      return "The file is empty or not parsed correctly";
    }
    if(this.utilsService.isJsonString(fileContent)){
      return "Invalid JSON content detected";
    }
    if(!fileContent.resourceType){
      return 'Invalid resource detected. Missing "Resource Type" property';
    }
    if (fileContent.resourceType != "Bundle"){
      return 'Invalid resource detected. The resource type must be Bundle';
    }
    return null;
  }

  private getPatientData(documentBundle: any): DecedentSimpleInfo {
    let decedentSimpleInfo: DecedentSimpleInfo = {name: '', dateTimeOfDeath: '', mdiTrackingNumber: ''};
    const patient = documentBundle.entry.find(entry => entry.resource?.resourceType === "Patient");
    if(patient){
      const name = this.getPatientName(patient?.resource);
      decedentSimpleInfo.name = name;
    }
    const composition = documentBundle.entry.find(entry => entry.resource?.resourceType === "Composition");
    if(composition){
      const caseNumber = composition?.resource?.extension[0]?.valueIdentifier?.value;
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
      .find(entry => entry.resource?.resourceType === "Observation" && entry.resource?.code?.coding[0]?.code === code)?.resource;
    return observation;
  }

  private getPatientName(patientResource: any): string {
    if(!patientResource || !(patientResource?.resourceType === "Patient")){
      console.warn("Invalid resource passed");
      return null;
    }
    //This title case may not be appropriate conversion
    const family = patientResource.name[0]?.family[0].toUpperCase() + patientResource.name[0]?.family.substring(1).toLowerCase();
    const given = patientResource.name[0]?.given[0];
    const name = given ? (family + ', '+  given) : family;

    return name;
  }
}
