import {Component, Input, OnInit} from '@angular/core';
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {UntypedFormBuilder} from "@angular/forms";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {UtilsService} from "../../../../../service/utils.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-edrs-results-step',
    templateUrl: './edrs-results-step.component.html',
    styleUrls: ['./edrs-results-step.component.scss'],
    standalone: false
})

export class EdrsResultsStepComponent implements OnInit {
  @Input('parentStepper') parentStepper: MatStepper;
  @Input() accessToken: string;

  decedentInfo: DecedentSimpleInfo;
  endpointConfigRendered = true;
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
    private route: ActivatedRoute
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
    this.searchEdrsService.endpoint$.subscribe({
      next: value => {
        console.log(value)
      }
    });

    this.route.url.subscribe( event =>
      // As per requirements the endpoint configuration is not rendered in the search-edrs-workflow
      this.endpointConfigRendered = event[0].path !== 'search-edrs-bluejay'
    );
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


