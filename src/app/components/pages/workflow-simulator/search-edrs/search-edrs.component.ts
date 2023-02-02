import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {MatTabGroup} from "@angular/material/tabs";
import {UiStringConstants} from "../../../../providers/ui-string-constants";

@Component({
  selector: 'app-search-edrs',
  templateUrl: './search-edrs.component.html',
  styleUrls: ['./search-edrs.component.scss'],
  encapsulation: ViewEncapsulation.None // we need this to disable the header for the stepper and use it as an indicator
})
export class SearchEdrsComponent implements OnInit {

  documentBundle: any;

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('mdiToEdrsTabGroup') private mdiToEdrsTabGroup: MatTabGroup;

  uiConstants: any;

  constructor(
    private formBuilder: FormBuilder,
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
  }

  tabSelectionChange() {
    this.searchEdrsService.setDocumentBundle(null);
    this.searchEdrsService.setDecedentData(null);
  }

  onAdvanceStepper() {
    this.stepper.next();
  }
}
