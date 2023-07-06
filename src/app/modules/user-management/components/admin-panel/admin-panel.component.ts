import {Component, Inject} from '@angular/core';
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {tap} from "rxjs";
import {AuthService, User} from '@auth0/auth0-angular';
import {environment as env} from "../../../../../environments/environment";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  currentUser: any;
  env = env;

  constructor(
    private userProfileManager: UserProfileManagerService,
    public auth: AuthService,
    ) {

    this.userProfileManager.currentUser$.pipe(tap(console.log)).subscribe({next: value => {this.currentUser = value;}});
    this.userProfileManager.getAllUsers().pipe(tap(console.log)).subscribe();

  }
}
