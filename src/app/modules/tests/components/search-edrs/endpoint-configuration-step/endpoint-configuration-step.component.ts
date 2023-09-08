import {Component, Inject, OnInit} from "@angular/core";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {ModuleHeaderConfig} from "../../../../../model/model-header-config";
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {ConfigService} from "../../../../../service/config.service";
import {Config} from "../../../../../model/config";

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

  config: Config;

  constructor(
    @Inject('workflowSimulatorConfig') public moduleConfig: ModuleHeaderConfig,
    private searchEdrsService: SearchEdrsService,
    private formBuilder: UntypedFormBuilder,
    uiStringConstants: UiStringConstants,
    private configService: ConfigService
  ) {
    this.config = this.configService.config;
    this.blueJayUri = this.config.blueJayServerBaseUrl;

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
    window.open(this.config.blueJayServerBaseUrl + "OperationDefinition/Composition-it-mdi-documents", "_blank");
  }

  onViewServerCapabilityStmt() {
    window.open(this.config.blueJayServerBaseUrl + "metadata", "_blank");
  }

  onSelected(endpointConfigurationFormGroup: UntypedFormGroup) {
  }
}
