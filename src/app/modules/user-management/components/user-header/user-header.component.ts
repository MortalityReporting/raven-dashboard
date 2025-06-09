import {Component, signal} from '@angular/core';
import {map, Observable, of, skipWhile, tap} from "rxjs";
import {UserProfile} from "../../models/user-profile";
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {AuthService, User} from "@auth0/auth0-angular";
import {environment as env} from "../../../../../environments/environment";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-user-header',
    templateUrl: './user-header.component.html',
    styleUrls: ['./user-header.component.scss'],
    standalone: false
})
export class UserHeaderComponent {
  currentUser$: Observable<UserProfile> = new Observable<UserProfile>(null);
  env = env;
  currentUser= signal<User>(null)

  constructor(
    private userProfileManager: UserProfileManagerService,
    public auth: AuthService,
  ) {
    this.auth.user$.pipe(
      skipWhile(value => !value)
    ).subscribe({
        next: user => {
          this.userProfileManager.setCurrentUser(user);
          this.currentUser.set(user);
        }
      }
    )
    this.currentUser$ = this.userProfileManager.currentUser$;
    this.currentUser$.subscribe();
  }
}
