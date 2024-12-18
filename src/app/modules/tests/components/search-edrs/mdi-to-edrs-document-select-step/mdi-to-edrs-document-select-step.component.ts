import {Component, Inject, Input, OnInit} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";

@Component({
    selector: 'app-mdi-to-edrs-document-select-step',
    templateUrl: './mdi-to-edrs-document-select-step.component.html',
    styleUrls: ['./mdi-to-edrs-document-select-step.component.scss'],
    standalone: false
})
export class MdiToEdrsDocumentSelectStepComponent implements OnInit {
  @Input('parentStepper') parentStepper: MatStepper;

  uiConstants: any;

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
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
