import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CaseAdminInfo} from "../../../../models/dcr-record";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-dcr-content-case-admin-info',
  standalone: false,
  templateUrl: './dcr-content-case-admin-info.component.html',
  styleUrl: './dcr-content-case-admin-info.component.css'
})
export class DcrContentCaseAdminInfoComponent implements OnChanges{
  @Input() caseAdminInfo!: CaseAdminInfo;

  constructor(private sanitizer: DomSanitizer) {}
  signatureUrl: SafeUrl;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['caseAdminInfo'].currentValue?.signature) {
      this.signatureUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${this.caseAdminInfo.signature}`);
    }
  }
}
