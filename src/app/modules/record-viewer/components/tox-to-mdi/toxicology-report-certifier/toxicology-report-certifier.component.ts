import {Component, Input} from '@angular/core';
import {CertifierAndOrganization, ToxSummary} from "../../../models/tox.summary";


@Component({
  selector: 'record-viewer-toxicology-report-certifier',
  templateUrl: './toxicology-report-certifier.component.html',
  styleUrls: ['../toxicology-report.component.scss']
})
export class ToxicologyReportCertifierComponent {
  @Input() certifier: CertifierAndOrganization;
  @Input() toxSummary: ToxSummary;

  constructor() { }

}