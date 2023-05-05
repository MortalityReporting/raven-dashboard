import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AppConfiguration} from "../../providers/app-configuration";
import {ModuleHeaderConfig} from "../../providers/module-header-config";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
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
