import {Component} from '@angular/core';
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {tap} from "rxjs";
import {AuthService, User} from '@auth0/auth0-angular';
import {environment as env} from "../../../../../environments/environment";
import {DashboardApiInterfaceService} from "../../../../service/dashboard-api-interface.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  currentUser: any;
  env = env;
  events: any = undefined;
  error: any = undefined;

  constructor(
    private userProfileManager: UserProfileManagerService,
    public auth: AuthService,
    private dashboardApiInterface: DashboardApiInterfaceService) {

    this.userProfileManager.currentUser$.pipe(tap(console.log)).subscribe({next: value => {this.currentUser = value;}});
    this.userProfileManager.getAllUsers().pipe(tap(console.log)).subscribe();

    this.dashboardApiInterface.getAdminPanelData().subscribe({
      next: value => {
        console.log(value)
        this.error = undefined;
        this.events = value['events'];
      },
      error: (e) => {
        this.events = undefined;
        console.error(e)
        this.error = e;
      }
    })
  }
}
