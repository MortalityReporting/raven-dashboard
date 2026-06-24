import {Component, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import {Observable, skipWhile} from "rxjs";
import {UserProfile} from "../../models/user-profile";
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {AuthService, User} from "@auth0/auth0-angular";
import {ConfigService} from "../../../../config/config.service";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-user-header',
    templateUrl: './user-header.component.html',
    styleUrls: ['./user-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        AsyncPipe
    ]
})
export class UserHeaderComponent implements OnInit {
  currentUser$: Observable<UserProfile> = new Observable<UserProfile>(null);
  protected readonly adminLogoutUrl = signal<string>('');
  currentUser= signal<User>(null)

  constructor(
    private userProfileManager: UserProfileManagerService,
    public auth: AuthService,
    private configService: ConfigService
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

  ngOnInit(): void {
    // Access config in ngOnInit, which runs after APP_INITIALIZER completes
    if (this.configService.config?.auth?.logoutUrl) {
      this.adminLogoutUrl.set(this.configService.config.auth.logoutUrl);
    }
  }
}
