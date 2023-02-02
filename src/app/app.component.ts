import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Raven';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
  }
  ngOnInit(): void {
    const path = "assets"
    this.matIconRegistry.addSvgIcon("labs", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/labs.svg`));
    this.matIconRegistry.addSvgIcon("lab_panel", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/lab_panel.svg`));
    this.matIconRegistry.addSvgIcon("clinical_notes", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/clinical_notes.svg`));
  }
}
