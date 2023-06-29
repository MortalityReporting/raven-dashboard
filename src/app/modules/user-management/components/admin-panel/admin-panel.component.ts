import {Component, Inject} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {Router} from "@angular/router";
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {concat, from, map, Observable, of, skipWhile, tap} from "rxjs";
import {AuthService, User} from '@auth0/auth0-angular';
import {UserProfile} from "../../models/user-profile";
import {environment as env} from "../../../../../environments/environment";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  currentUser$: Observable<UserProfile> = new Observable<UserProfile>(null);
  currentUserImage$: Observable<any> = new Observable<any>(null)
  env = env;

  constructor(
    private userProfileManager: UserProfileManagerService,
    public auth: AuthService,
    ) {

    // TODO: REMOVE, PROVIDED FOR EXAMPLES/TESTING
    // this.userProfileManager.checkIfUserEmailExists("user@example.com").pipe(
    //   tap(console.log) // Should be True
    // ).subscribe();
    // this.userProfileManager.checkIfUserEmailExists("notarealemail@emailplace.com").pipe(
    //   tap(console.log) // Should be False
    // ).subscribe();
    // this.userProfileManager.createUserProfile("Test Create Sr.", "testcreate@test.com").pipe(
    //   tap(console.log)
    // ).subscribe()
    this.userProfileManager.getAllUsers().pipe(tap(console.log)).subscribe()

    this.auth.user$.pipe(
      skipWhile(value => !value)
    ).subscribe({
        next: user => {
          console.log(user);
          this.getUserDetails(user.name, user.email);
        }
      }
    )

    this.currentUserImage$ = this.userProfileManager.getUserProfileImage("624703");
    this.currentUserImage$.pipe(tap(console.log)).subscribe();
  }

  getUserDetails(name: string, email: string) {
    this.userProfileManager.getUserProfile(email).subscribe({
      next: (userProfile: UserProfile) => {
        if (userProfile) {
          this.currentUser$ = of(userProfile);
        }
        else {
          console.log("User Profile not found on FHIR Server, creating new Resource.")
          this.currentUser$ = this.userProfileManager.createUserProfile(name, email);
        }
        this.currentUser$.pipe(
          map((userProfile: UserProfile) => {
            this.getUserProfileImage(userProfile.fhirId);
            return userProfile
          })
        )
      }
    });
  }

  getUserProfileImage(id: string) {
    return this.currentUserImage$ = this.userProfileManager.getUserProfileImage(id).pipe(
      tap()
    );
  }
}
