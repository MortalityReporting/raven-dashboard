import {Component, Input, OnInit} from '@angular/core';
import {ActivationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {FhirExplorerDrawerService} from "../../../fhir-explorer/services/fhir-explorer-drawer.service";
import {ModuleHeaderService} from "../../../../service/module-header.service";

@Component({
  selector: 'app-module-header',
  templateUrl: './module-header.component.html',
  styleUrls: ['./module-header.component.css']
})
export class ModuleHeaderComponent implements OnInit {

  @Input() moduleDetails: any;
  showHeader: boolean = false;
  moduleTitle = undefined;
  componentTitle = undefined;
  backgroundColor = undefined;
  icon = undefined;

  constructor(private router: Router,
              public fhirExplorerDrawerService: FhirExplorerDrawerService,
              private moduleHeaderService: ModuleHeaderService
  ) { }

  ngOnInit(): void {
    this.moduleHeaderService.moduleHeaderConfig$.subscribe(value => {
      this.showHeader = value.showHeader;
      this.moduleTitle = value.moduleTitle;
      this.backgroundColor = value.backgroundColor;
      this.componentTitle = value.componentTitle;
      this.icon = value.icon;
    });
  }
  onToggle() {
    this.fhirExplorerDrawerService.toggle();
  }
}
