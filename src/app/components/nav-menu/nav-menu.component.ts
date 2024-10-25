import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatTooltip} from "@angular/material/tooltip";
import {NavigationEnd, Router} from "@angular/router";
import {AsyncPipe, NgClass} from "@angular/common";
import {filter} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {AppConstants} from "../../providers/app-constants";

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatIcon,
    MatDivider,
    MatTooltip,
    NgClass,
    AsyncPipe,
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
    { name: 'testing-events', display: 'Testing Events', route: 'testing-events', icon: 'testing_event', loginRequired: false},
    { name: 'event-registration', display: 'Event Registration', route: 'event-registration', icon: 'event_register', loginRequired: true},
    { name: 'admin-panel', display: 'Admin Panel',  route: 'admin-panel', icon: 'admin_panel', loginRequired: true, requiredRole: this.appConstants.USER_ROLES.ADMIN}
  ]

  constructor(public router: Router, public authService: AuthService, protected appConstants: AppConstants) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.currentRoute = e?.['urlAfterRedirects']?.substring(1).split('/')[0];
    });
    this.authService.idTokenClaims$.subscribe(tokenClaims => {
      this.TESTING_AND_EVENTS_CONFIG = this.TESTING_AND_EVENTS_CONFIG.filter(item => {
        if(!item['loginRequired']){
          return true;
        }
        else if(!tokenClaims){
          return false;
        }
        else if(!item['role']){
          return true;
        }
        else {
          return tokenClaims?.[`urn:raven/${item.requiredRole}`];
        }
      })
    })
  }

  onPathSelected(path: string){
    this.router.navigate([path]);
  }

}
