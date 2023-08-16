import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SearchEdrsService} from "../../services/search-edrs.service";
import {UiStringConstants} from "../../../../providers/ui-string-constants";

/*
Parent component for the Search EDRS flow
*/

@Component({
  selector: 'app-search-edrs',
  templateUrl: './search-edrs.component.html',
  styleUrls: ['./search-edrs.component.scss'],
  encapsulation: ViewEncapsulation.None // we need this to disable the header for the stepper and use it as an indicator
})
export class SearchEdrsComponent implements OnInit {

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
  }

}
