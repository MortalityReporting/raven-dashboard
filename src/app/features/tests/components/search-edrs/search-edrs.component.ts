import {Component, EventEmitter, OnInit, Output, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {SearchEdrsService} from "../../services/search-edrs.service";
import {UiStringConstants} from "../../../../providers/ui-string-constants";
import {TestStatusCodes} from "../../../testing-events";
import { MatCard } from '@angular/material/card';
import { MatStepper, MatStep, MatStepperPrevious } from '@angular/material/stepper';
import { MdiToEdrsDocumentSelectStepComponent } from './mdi-to-edrs-document-select-step/mdi-to-edrs-document-select-step.component';
import { EndpointConfigurationStepComponent } from './endpoint-configuration-step/endpoint-configuration-step.component';
import { EdrsResultsStepComponent } from './edrs-results-step/edrs-results-step.component';
import { MatButton } from '@angular/material/button';

/*
Parent component for the Search EDRS flow
*/

@Component({
    selector: 'app-search-edrs',
    templateUrl: './search-edrs.component.html',
    styleUrls: ['./search-edrs.component.scss'],
    encapsulation: ViewEncapsulation.None // we need this to disable the header for the stepper and use it as an indicator
    ,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatStepper, MatStep, MdiToEdrsDocumentSelectStepComponent, EndpointConfigurationStepComponent, EdrsResultsStepComponent, MatButton, MatStepperPrevious]
})
export class SearchEdrsComponent implements OnInit {
  @Output() onTestCompletedEvent = new EventEmitter<any>()

  documentBundle: any;
  uiConstants: any;

  constructor(
    private searchEdrsService: SearchEdrsService,
    private uiStringConstants: UiStringConstants,
  ) {
    this.uiConstants = uiStringConstants.WorkflowSimulator.searchEdrs;
  }

  ngOnInit(): void {
    this.searchEdrsService.documentBundle$.subscribe({
      next: value => {
        this.documentBundle = value
      }
    });
    this.searchEdrsService.testStatus$.subscribe(() => this.onTestCompletedEvent.emit(TestStatusCodes.complete));
  }

}
