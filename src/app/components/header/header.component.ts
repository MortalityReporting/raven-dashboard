import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FhirExplorerDrawerService} from "../../fhir-explorer/services/fhir-explorer-drawer.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  version = environment.VERSION

  constructor(
    private router: Router,
    public fhirExplorerDrawerService: FhirExplorerDrawerService
  ) { }

  onTitleClick() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
  }

  onToggle() {
    this.fhirExplorerDrawerService.toggle();
  }
}
