import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FhirExplorerDrawerService} from "../../modules/fhir-explorer/services/fhir-explorer-drawer.service";
import { environment } from "../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {openConformationDialog} from "common-ui";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  version = environment.VERSION;

  constructor(
    private router: Router,
    public fhirExplorerDrawerService: FhirExplorerDrawerService,
    private dialog: MatDialog
  ) { }

  onToggle() {
    this.fhirExplorerDrawerService.toggle();
  }

  confirmPathTransition(confirmationMessage, path) {
    openConformationDialog(
      this.dialog,
      {
        title: "",
        content: confirmationMessage,
        primaryActionBtnTitle: "Yes, leave session",
        secondaryActionBtnTitle: "No, stay in workflow",
        width: "35em",
        height: "12em",
        isPrimaryButtonLeft: true
      })
      .subscribe(
        action => {
          if (action == 'primaryAction') {
            this.router.navigate([path]);
          }
        }
      );
  }

  onMenuItemSelected(path) {
    if(this.router.url.indexOf('workflow-simulator/') > 0) { //Prompt the user that they can lose their current session in the workflow simulator if they leave.
      this.confirmPathTransition("Leaving the workflow will lose progress in the current session. Do you wish to continue?", path);
    }
    else {
      this.router.navigate([path]);
    }
  }
}
