import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {SearchEdrsService} from "../../services/search-edrs.service";
import {UiStringConstants} from "../../../../providers/ui-string-constants";
import {TestStatusCodes} from "../../../testing-events";
import {AccessTokenService} from "../../services/access-token.service";

@Component({
  selector: 'app-search-edrs-bluejay',
  templateUrl: './search-edrs-bluejay.component.html',
  styleUrl: './search-edrs-bluejay.component.css'
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
    this.uiConstants = uiStringConstants.WorkflowSimulator.searchEdrsBlueJay;
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
