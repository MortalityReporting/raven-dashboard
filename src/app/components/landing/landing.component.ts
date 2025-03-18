import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AppConfiguration} from "../../providers/app-configuration";

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    standalone: false
})
export class LandingComponent implements OnInit {

  appConfiguration: any = AppConfiguration.config;

  constructor(private router: Router) { }

  onBtnClick(url: string): void {
    this.router.navigate([url]);
  }

  ngOnInit(): void {
  }

}
