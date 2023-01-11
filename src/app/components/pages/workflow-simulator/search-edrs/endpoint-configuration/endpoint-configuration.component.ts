import { Component, OnInit } from '@angular/core';
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../../../service/search-edrs.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {blueJay, environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-endpoint-configuration',
  templateUrl: './endpoint-configuration.component.html',
  styleUrls: ['./endpoint-configuration.component.css']
})
export class EndpointConfigurationComponent implements OnInit {
  endpointTypeOptions: string[];
  authenticationOptions: string [];

  uiConstantsStep2: any;
  commonUIConstants: any

  //TODO extract those as constants
  serverEndpointList: any[] = [
    {uri: blueJay.serverBase, displayName: 'BlueJay'},
    {uri: 'www.gavers.edu', displayName: 'GAVERS'},
  ];

  endpointConfigurationFormGroup: FormGroup
  decedentInfo: DecedentSimpleInfo;

  constructor(
    private searchEdrsService: SearchEdrsService,
    private formBuilder: FormBuilder,
    uiStringConstants: UiStringConstants
  ) {
    this.uiConstantsStep2 = uiStringConstants.WorkflowSimulator.searchEdrs.step2;
    this.commonUIConstants = uiStringConstants.Common;

    this.endpointTypeOptions = this.uiConstantsStep2.endpointTypeOptions;
    this.authenticationOptions = this.uiConstantsStep2.authenticationOptions;

    this.endpointConfigurationFormGroup = this.formBuilder.group({
      inputType: [this.endpointTypeOptions[0]],

      registeredEndpoint: this.formBuilder.group({
        serverEndpoint: [this.serverEndpointList[0].uri],
      }),

      customEndpoint: this.formBuilder.group({
        customEndpointUrl: [''],
        authenticationType: [this.authenticationOptions[0]],

        userNamePassword: this.formBuilder.group({
          username: [''],
          password: ['']
        }),

        bearerToken: this.formBuilder.group({
          token: ['']
        }),
      })

    });
  }

  onSubmitEndpointConfiguration() {
    console.log(this.endpointConfigurationFormGroup);
  }

  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });
  }

  onViewServerMdiDocs() {
    window.open(blueJay.serverBase + "/OperationDefinition/Composition-it-mdi-documents", "_blank");
  }

  onViewServerCapabilityStmt() {
    window.open(blueJay.serverBase + "/metadata", "_blank");
  }
}
