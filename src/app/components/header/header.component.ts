import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FhirExplorerDrawerService} from "../../service/fhir-explorer-drawer.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

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
