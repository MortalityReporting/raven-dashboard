import {Component, EventEmitter, OnDestroy, OnInit, Output, ChangeDetectionStrategy} from '@angular/core';
import {SearchEdrsService} from "../../services/search-edrs.service";
import {UiStringConstants} from "../../../../providers/ui-string-constants";
import {TestStatusCodes} from "../../../testing-events";
import {AccessTokenService} from "../../services/access-token.service";
import { MatCard } from '@angular/material/card';
import { MatStepper, MatStep, MatStepperPrevious } from '@angular/material/stepper';
import { MdiToEdrsDocumentSelectStepComponent } from '../search-edrs/mdi-to-edrs-document-select-step/mdi-to-edrs-document-select-step.component';
import { EstablishConnectionComponent } from './establish-connection/establish-connection.component';
import { EdrsResultsStepComponent } from '../search-edrs/edrs-results-step/edrs-results-step.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-search-edrs-bluejay',
    templateUrl: './search-edrs-bluejay.component.html',
    styleUrl: './search-edrs-bluejay.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatStepper, MatStep, MdiToEdrsDocumentSelectStepComponent, EstablishConnectionComponent, EdrsResultsStepComponent, MatButton, MatStepperPrevious]
})
export class SearchEdrsBluejayComponent implements OnInit, OnDestroy{
  @Output() onTestCompletedEvent = new EventEmitter<any>()

  documentBundle: any;
  uiConstants: any;

  constructor(
    private searchEdrsService: SearchEdrsService,
    private uiStringConstants: UiStringConstants,
    private accessTokenService: AccessTokenService,
  ) {
    this.uiConstants = this.uiStringConstants.WorkflowSimulator.searchEdrsBlueJay;
  }

  ngOnInit(): void {
    this.searchEdrsService.documentBundle$.subscribe({
      next: value => {
        this.documentBundle = value
      }
    });
    this.searchEdrsService.testStatus$.subscribe(() => this.onTestCompletedEvent.emit(TestStatusCodes.complete));
  }

  ngOnDestroy(): void {
    //destroy the token when we exit the component
    this.accessTokenService.setAccessTokenValue(null);
  }
}
