import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {OptionConfig} from "common-ui";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Raven';
  version = environment.VERSION;
  optionConfig: OptionConfig;

  // TODO: remove extra code once confirmed working on live.
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ) {
  }
  ngOnInit(): void {
    const path = "assets"
    this.matIconRegistry.addSvgIcon("home", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/home.svg`));
    this.matIconRegistry.addSvgIcon("record_comparison", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/record-comparison.svg`));
    this.matIconRegistry.addSvgIcon("record_viewer", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/record-viewer.svg`));
    this.matIconRegistry.addSvgIcon("record_import", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/record-import.svg`));
    this.matIconRegistry.addSvgIcon("workflow_simulator", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/workflow-simulator.svg`));
    this.matIconRegistry.addSvgIcon("fhir_validator", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/fhir-validator.svg`));

    this.optionConfig = {
      options: [
        {
          routerLink: "/",
          label: "Home",
          iconName: "home"
        },
        {
          routerLink: "/",
          label: "Record Viewer",
          iconName: "record_viewer"
        },
        {
          routerLink: "/",
          label: "Record Import",
          iconName: "record_import"
        },
        {
          routerLink: "/",
          label: "Record Comparison",
          iconName: "record_comparison"
        },
        {
          routerLink: "/",
          label: "FHIR Validator",
          iconName: "fhir_validator"
        },
        {
          routerLink: "/",
          label: "Workflow Simulator",
          iconName: "workflow_simulator"
        }
      ]
    }
  }
}
