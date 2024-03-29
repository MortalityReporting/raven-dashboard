import {Component, Input, OnInit} from '@angular/core';
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {UntypedFormBuilder} from "@angular/forms";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {UtilsService} from "../../../../../service/utils.service";

@Component({
  selector: 'app-edrs-results-step',
  templateUrl: './edrs-results-step.component.html',
  styleUrls: ['./edrs-results-step.component.scss']
})

export class EdrsResultsStepComponent implements OnInit {
  @Input('parentStepper') parentStepper: MatStepper;
  decedentInfo: DecedentSimpleInfo;

  uiConstantsStep3: any;
  commonUIConstants: any;
  errorResponse: any;
  successResponse: any;
  selectedEdrsRecord: any;
  edrsServer: string = "BlueJay"; //TODO this will be populated from step 2 in the future

  constructor(
    private searchEdrsService: SearchEdrsService,
    private fb: UntypedFormBuilder,
    private utilsService: UtilsService,
    uiStringConstants: UiStringConstants,
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
    console.log("IN STEP 3")
    this.searchEdrsService.endpoint$.subscribe({
      next: value => {
        console.log(value)
      }
    })
  }

  updatedSearchResults(event) {
    if(event.success){
      this.successResponse = event.response;
      this.errorResponse = null;
    }
    else {
      this.errorResponse = event.response;
      this.successResponse = null;
    }
  }

  onChangeEndpointConfiguration() {
    this.parentStepper.previous();
  }

  onSelectDifferentDocument() {
    this.parentStepper.reset();
  }

  onEdrsRecordSelected(event: any) {
    this.selectedEdrsRecord = event;
  }
}


