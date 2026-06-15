import {Component, Inject, Input, OnInit} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MdiToEdrsGridComponent } from './mdi-to-edrs-grid/mdi-to-edrs-grid.component';
import { ImportMdiToEdrsDocumentComponent } from './import-mdi-to-edrs-document/import-mdi-to-edrs-document.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-mdi-to-edrs-document-select-step',
    templateUrl: './mdi-to-edrs-document-select-step.component.html',
    styleUrls: ['./mdi-to-edrs-document-select-step.component.scss'],
    imports: [MatCard, MatCardContent, MatTabGroup, MatTab, MdiToEdrsGridComponent, ImportMdiToEdrsDocumentComponent, MatButton]
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
