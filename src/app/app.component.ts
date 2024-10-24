import {Component, OnInit} from '@angular/core';
import {platformBrowser} from "@angular/platform-browser";
import { HeaderConfig} from "ngx-hisb-common-ui";
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
  headerConfig: HeaderConfig;

  // TODO: remove extra code once confirmed working on live.
  constructor(
    private configService: ConfigService,
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
