import { Component } from '@angular/core';
import {map, Observable, of, skipWhile, tap} from "rxjs";
import {UserProfile} from "../../models/user-profile";
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {AuthService} from "@auth0/auth0-angular";
import {environment as env} from "../../../../../environments/environment";

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {
  currentUser$: Observable<UserProfile> = new Observable<UserProfile>(null);
  //currentUserImage$: Observable<any> = new Observable<any>(null)
  env = env;

  constructor(
    private userProfileManager: UserProfileManagerService,
    public auth: AuthService,
  ) {
    this.currentUser$ = this.userProfileManager.currentUser$;
    this.currentUser$.subscribe();

    this.auth.user$.pipe(
      skipWhile(value => !value)
    ).subscribe({
        next: user => {
          console.log(user);
          this.userProfileManager.setCurrentUser(user);
        }
      }
    )
  }

  //
  // getUserDetails(name: string, email: string) {
  //   this.userProfileManager.getUserProfile(email).subscribe({
  //     next: (userProfile: UserProfile) => {
  //       if (userProfile) {
  //         this.userProfileManager.setCurrentUser(userProfile);
  //       }
  //       else {
  //         console.log("User Profile not found on FHIR Server, creating new Resource.")
  //         this.userProfileManager.createUserProfile(name, email);
  //       }
  //       this.currentUser$.pipe(
  //         map((userProfile: UserProfile) => {
  //           // this.getUserProfileImage(userProfile.fhirId);
  //           return userProfile
  //         })
  //       )
  //     }
  //   });
  // }
}
