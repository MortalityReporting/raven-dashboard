import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AppConfiguration} from "../../providers/app-configuration";
import {ConfigService} from "../../config/config.service";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { CardHoverDirective } from '../../directives/card-hover.directive';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    imports: [MatCard, MatCardContent, MatIcon, MatDivider, CardHoverDirective, MatCardHeader, MatCardTitle, MatButton]
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
