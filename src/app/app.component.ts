import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {OptionConfig, HeaderConfig} from "common-ui";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Raven';
  version = environment.VERSION;
  optionConfig: OptionConfig;
  headerConfig: HeaderConfig;

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
          routerLink: "/records",
          label: "Record Viewer",
          iconName: "record_viewer"
        },
        {
          routerLink: "/import-case",
          label: "Record Import",
          iconName: "record_import"
        },
        {
          routerLink: "/comparison",
          label: "Record Comparison",
          iconName: "record_comparison"
        },
        {
          routerLink: "/fhir-validator",
          label: "FHIR Validator",
          iconName: "fhir_validator"
        },
        {
          routerLink: "/workflow-simulator",
          label: "Workflow Simulator",
          iconName: "workflow_simulator"
        }
      ]
    }
    this.headerConfig = {
      menuItem: [
        {
          label: "Documentation",
          link: "https://ravendocs.readthedocs.io/en/latest/"
        },
        {
          label: "Mortality Reporting GitHub",
          link: "https://github.com/MortalityReporting"
        },
        {
          divider: true
        },
        {
          label: "FHIR Zulip Chat",
          link: "https://chat.fhir.org"
        }
      ]
    }
  }
}
