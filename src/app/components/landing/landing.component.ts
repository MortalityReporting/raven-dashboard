import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AppConfiguration} from "../../providers/app-configuration";
import {ConfigService} from "../../config/config.service";

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    standalone: false
})
export class LandingComponent{

  appConfiguration: any = AppConfiguration.config;

  constructor(private router: Router, private configService: ConfigService) { }

  onBtnClick(url: string): void {
    this.router.navigate([url]);
  }

  openPdf() {
    window.open(this.configService.getApiUrl("dashboardApiUrl") + "files/TerminologyServicePoC.pdf ", "_blank");
  }
}
