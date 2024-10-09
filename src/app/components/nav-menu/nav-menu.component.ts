import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatTooltip} from "@angular/material/tooltip";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NgClass} from "@angular/common";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatIcon,
    MatDivider,
    MatTooltip,
    NgClass
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
  isExpanded: boolean = true;

  currentRoute: string;

  MDI_RECORDS_CONFIG = [
    { name: 'record-viewer', display: 'Viewer', route: 'record-viewer', icon: 'record-viewer'},
    { name: 'record-import', display: 'Import', route: 'record-import', icon: 'record-import'},
    { name: 'record-comparison', display: 'Comparison', route: 'record-comparison', icon: 'record-comparison'},
    { name: 'fhir-validator', display: 'Validator',  route: 'fhir-validator', icon: 'fhir-validator'}
  ]

  TESTING_AND_EVENTS_CONFIG = [
    { name: 'workflow-simulator', display: 'Workflow Simulator', route: 'workflow-simulator', icon: 'workflow-simulator'},
    { name: 'testing-event', display: 'Testing Event', route: 'testing-event', icon: 'testing_event'},
    { name: 'event-registration', display: 'Event Registration', route: 'event-registration', icon: 'event_register'},
    { name: 'admin-panel', display: 'Event Admin Panel',  route: 'admin-panel', icon: 'admin_panel'}
  ]

  constructor(private activatedRoute: ActivatedRoute, public router: Router ) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.currentRoute = e?.['urlAfterRedirects']?.substring(1)
    });
  }

  onPathSelected(path: string){
    this.router.navigate([path]);
  }

}
