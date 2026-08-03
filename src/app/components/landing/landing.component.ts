import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Router} from "@angular/router";
import {AppConfiguration} from "../../providers/app-configuration";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { CardHoverDirective } from '../../directives/card-hover.directive';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatCardContent, MatIcon, MatDivider, CardHoverDirective, MatCardHeader, MatCardTitle, MatButton]
})
export class LandingComponent{

  appConfiguration: any = AppConfiguration.config;

  constructor(private router: Router) { }

  onBtnClick(url: string): void {
    this.router.navigate([url]);
  }

  openPdf() {
    const link = document.createElement('a');
    link.href = 'assets/files/TerminologyServicePoC.pdf';
    link.download = 'TerminologyServicePoC.pdf';
    link.click();
  }
}
