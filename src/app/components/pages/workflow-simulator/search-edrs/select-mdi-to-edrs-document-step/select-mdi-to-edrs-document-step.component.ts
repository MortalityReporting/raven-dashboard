import {Component, Input, OnInit} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {SearchEdrsService} from "../../../../../service/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-select-mdi-to-edrs-document-step',
  templateUrl: './select-mdi-to-edrs-document-step.component.html',
  styleUrls: ['./select-mdi-to-edrs-document-step.component.css']
})
export class SelectMdiToEdrsDocumentStepComponent implements OnInit {
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
