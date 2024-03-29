import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer, platformBrowser} from "@angular/platform-browser";
import {OptionConfig, HeaderConfig} from "ngx-hisb-common-ui";
import {AppConfiguration} from "./providers/app-configuration";
import {ThemeService} from "./service/theme.service";
import {ConfigService} from "./service/config.service";
import {Platform} from "@angular/cdk/platform";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title: string;
  subTitle = AppConfiguration.config.subTitle;
  version: string;
  color = AppConfiguration.config.color;
  contrastColor = AppConfiguration.config.contrastColor;
  optionConfig: OptionConfig;
  headerConfig: HeaderConfig;

  // TODO: remove extra code once confirmed working on live.
  constructor(
    private configService: ConfigService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private themeService: ThemeService,
    public platform: Platform,
    private _snackBar: MatSnackBar
    ) {
  }
  ngOnInit(): void {
    this.title = this.configService.config.title;
    this.version = this.configService.config.version;
    document.title = this.title;

    this.themeService.setColor(this.color);
    this.themeService.setContrastColor(this.contrastColor);

    const path = "assets"
    this.matIconRegistry.addSvgIcon("fhir_logo", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/LOGO_FHIR_2.svg`));

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
    this.matIconRegistry.addSvgIcon("admin_panel", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/admin-panel.svg`));

    this.optionConfig = {
      options: [
        {
          routerLink: "/",
          label: "Home",
          iconName: "home"
        },
        {
          routerLink: AppConfiguration.config.modules['recordViewer'].route,
          label: AppConfiguration.config.modules['recordViewer'].title,
          iconName: "record_viewer"
        },
        {
          routerLink: AppConfiguration.config.modules['recordImport'].route,
          label: AppConfiguration.config.modules['recordImport'].title,
          iconName: "record_import"
        },
        {
          routerLink: AppConfiguration.config.modules['recordComparison'].route,
          label: AppConfiguration.config.modules['recordComparison'].title,
          iconName: "record_comparison"
        },
        {
          routerLink: AppConfiguration.config.modules['fhirValidator'].route,
          label: AppConfiguration.config.modules['fhirValidator'].title,
          iconName: "fhir_validator"
        },
        {
          routerLink: AppConfiguration.config.modules['workflowSimulator'].route,
          label: AppConfiguration.config.modules['workflowSimulator'].title,
          iconName: "workflow_simulator"
        },
        {
          routerLink: AppConfiguration.config.modules['adminPanel'].route,
          label: AppConfiguration.config.modules['adminPanel'].title,
          iconName: "admin_panel"
        }
      ]
    }
    this.headerConfig = {
      menuItem: [
        {
          label: "MDI FHIR IG CI Build",
          link: "https://build.fhir.org/ig/HL7/fhir-mdi-ig/"
        },
        {
          divider: true
        },
        {
          label: "Raven Documentation",
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
    if(!(this.platform.BLINK || this.platform.FIREFOX) || !this.platform.isBrowser){
      this.showBrowserSupportWarningMessage("Raven is not fully supported by the browser you are currently using, and may not render content properly. For best results please use Google Chrome, Mozilla FireFox, or Microsoft Edge browsers.");
    }

  }

  showBrowserSupportWarningMessage(messageStr: string){
    this._snackBar.open(messageStr, 'X' ,{
      horizontalPosition: 'center',
      verticalPosition: 'top', //we offset the vertical position
      panelClass: ['browser-support-message-offset', 'app-notification-warn']
    });
  }

  protected readonly platformBrowser = platformBrowser;
}
