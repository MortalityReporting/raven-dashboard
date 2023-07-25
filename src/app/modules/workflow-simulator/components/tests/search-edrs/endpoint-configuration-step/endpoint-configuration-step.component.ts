import {Component, Inject, OnInit} from '@angular/core';
import {DecedentSimpleInfo} from "../../../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {UiStringConstants} from "../../../../../../providers/ui-string-constants";
import {ModuleHeaderConfig} from "../../../../../../providers/module-header-config";
import {EnvironmentHandlerService} from "../../../../../fhir-util";

@Component({
  selector: 'app-endpoint-configuration-step',
  templateUrl: './endpoint-configuration-step.component.html',
  styleUrls: ['./endpoint-configuration-step.component.scss']
})
export class EndpointConfigurationStepComponent implements OnInit {
  blueJayUri = '';
  endpointConfigurationFormGroup: UntypedFormGroup
  decedentInfo: DecedentSimpleInfo;
  endpointTypeOptions: string[];
  authenticationOptions: string [];

  uiConstantsStep2: any;
  commonUIConstants: any;
  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private searchEdrsService: SearchEdrsService,
    private formBuilder: UntypedFormBuilder,
    uiStringConstants: UiStringConstants,
    private environmentHandler: EnvironmentHandlerService,
  ) {
    this.blueJayUri = this.environmentHandler.getBlueJayServerBase();

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


  //TODO extract those as constants
  serverEndpointList: any[] = [
    {uri: this.blueJayUri, displayName: 'BlueJay'},
    {uri: 'www.gavers.edu', displayName: 'GAVERS'},
  ];

  onSubmitEndpointConfiguration() {
    //TODO: Replace, this is super quick implementation mid event.
   if (this.endpointConfigurationFormGroup.controls['inputType'].value === "Custom Endpoint") {
     const custom = this.endpointConfigurationFormGroup.controls['customEndpoint'].value;
     console.log(custom)
     const endpoint = custom.customEndpointUrl;
     const userPass = custom.userNamePassword;
     this.searchEdrsService.setEndpoint(
       endpoint, userPass
     )
   }
   else {
      this.searchEdrsService.setEndpoint(undefined, undefined); // TODO: Redo this.
   }
  }

  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });
  }

  onViewServerMdiDocs() {
    window.open(this.environmentHandler.getBlueJayServerBase() + "/OperationDefinition/Composition-it-mdi-documents", "_blank");
  }

  onViewServerCapabilityStmt() {
    window.open(this.environmentHandler.getBlueJayServerBase()  + "/metadata", "_blank");
  }

  onSelected(endpointConfigurationFormGroup: UntypedFormGroup) {
  }
}
