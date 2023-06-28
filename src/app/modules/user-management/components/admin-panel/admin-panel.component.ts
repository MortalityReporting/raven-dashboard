import {Component, Inject} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {Router} from "@angular/router";
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  constructor(
    private userProfileManager: UserProfileManagerService) {

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
  }
}
