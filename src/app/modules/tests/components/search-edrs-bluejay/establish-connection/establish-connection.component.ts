import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {ModuleHeaderConfig} from "../../../../../model/model-header-config";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {Clipboard} from '@angular/cdk/clipboard';
import {AccessTokenService} from "../../../services/access-token.service";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-establish-connection',
  templateUrl: './establish-connection.component.html',
  styleUrl: './establish-connection.component.scss'
})
export class EstablishConnectionComponent implements OnInit, OnDestroy {

  uiConstantsStep2: any;
  @Input('parentStepper') parentStepper: MatStepper;

  constructor(
    @Inject('workflowSimulatorConfig') public moduleConfig: ModuleHeaderConfig,
    private searchEdrsService: SearchEdrsService,
    private clipboard: Clipboard,
    uiStringConstants: UiStringConstants,
    private accessTokenService: AccessTokenService
  ) {
    this.uiConstantsStep2 = uiStringConstants.WorkflowSimulator.searchEdrsBlueJay.step2;
  }

  decedentInfo: DecedentSimpleInfo;
  bearerToken: string = '';

  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });
  }

  protected readonly JSON = JSON;
  errorMessage: string;

  onCopyToClipboard(value: string) {
    this.clipboard.copy(value.trim())
  }

  onRequestAuth0Token(){
    this.errorMessage = '';
    this.accessTokenService.getAccessToken().subscribe({
      next: value => {this.bearerToken = value;}
    })
  }

  ngOnDestroy(): void {
    this.accessTokenService.setAccessTokenValue(null);
  }

  onProceed(){
    if(this.bearerToken){
      this.parentStepper.next();
    }
    else{
      this.errorMessage = 'Request authorization token to proceed.';
    }
  }
}
