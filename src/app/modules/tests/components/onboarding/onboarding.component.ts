import {Component, OnInit, ViewChild} from '@angular/core';
import {LogLine} from "../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {MatAccordion} from "@angular/material/expansion";
import {LoggerService} from "ngx-hisb-logger";
import {UtilsService} from "../../../../service/utils.service";

export interface Stage {
  expanded: boolean;
  formData?: any;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})

export class OnboardingComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private log: LoggerService,
    private utilsService: UtilsService
  ){}

  loggerData: LogLine[];
  stageList: Stage[] =[];
  MAX_FILE_SIZE = 10000;
  formValueAcc: any[] = [];


  clearLog(){
    this.log.clear()
  }

  ngOnInit(): void {
    this.log.logStream$.subscribe(value=> this.loggerData = value);
    this.addStage();
  }

  addStage() {
    this.stageList.push({expanded: true})
  }

  removeComponent(index: number) {
    this.stageList.splice(index, 1);
  }

  getStageIndex(i: number) {
    return i+1;
  }


  onExportStage(formValueAcc) {
    const filename = 'saved_connection.json';
    // let formValue = this.onboardingForm.value;
    //For security reason we always want to remove the password (we should never save user passwords)

    formValueAcc.forEach(element => {
      if(element.password){
        element.password = '';
      }
    });
    console.log(formValueAcc);
    const file = new Blob([JSON.stringify(formValueAcc)], {type: "application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    link.remove();
  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if(!file){
      this.utilsService.showErrorMessage("Unable to open the file.");
    }
    else if (file.size > this.MAX_FILE_SIZE){
      console.error("File too big")
      this.utilsService.showErrorMessage("This file exceeds " + this.MAX_FILE_SIZE /  1000 + "kb and cannot be processed");
    }
    else {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");

      fileReader.onload = () => {
        this.parseFormData(JSON.parse(fileReader.result as string))
      }
      fileReader.onerror = (error) => {
        this.utilsService.showErrorMessage("Error reading the file.")
      }
    }
  }

  /**
   * This parser converts the network connection settings data (stored in JSON format) to appropriate Stage data,
   * which we pass to the children http-connection components.
   *
   * @param formDataList json representation of the network configuration stage data
   * @private
   */
  private parseFormData(formDataList: any[]) {
    //clear the current stage list
    this.stageList = [];
    //populate the stage list with blank elements
    formDataList.forEach(formElement => this.addStage());

    //add the form data to each of the elements (fill each stage with data)
    formDataList.forEach((formElement, index) => this.stageList[index].formData = formElement);
  }

  onFormValueChange(event: any, index: number) {
    if(this.formValueAcc?.[index]){
      this.formValueAcc[index] = event.formValue;
    }
    else {
      this.formValueAcc.push(event.formValue);
    }
  }
}
