import {Component, Input, OnInit} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {SearchEdrsService} from "../../../../../service/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-mdi-to-edrs-document-select-step',
  templateUrl: './mdi-to-edrs-document-select-step.component.html',
  styleUrls: ['./mdi-to-edrs-document-select-step.component.css']
})
export class MdiToEdrsDocumentSelectStepComponent implements OnInit {
  @Input('parentStepper') parentStepper: MatStepper;

  uiConstants: any;

  constructor(
    private uiStringConstants: UiStringConstants,
    private searchEdrsService: SearchEdrsService
  ) {
    this.uiConstants = uiStringConstants.WorkflowSimulator.searchEdrs;
  }

  ngOnInit(): void {
  }

  onAdvanceStepper() {
    this.parentStepper.next();
  }

  tabSelectionChange() {
    this.searchEdrsService.setDocumentBundle(null);
    this.searchEdrsService.setDecedentData(null);
  }
}
