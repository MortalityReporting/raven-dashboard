import {Component, Input} from '@angular/core';
import {CertifierAndOrganization, ToxSummary} from "../../../models/tox.summary";

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-certifier',
    templateUrl: './tox-to-mdi-viewer-certifier.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    standalone: false
})
export class ToxToMdiViewerCertifierComponent {
  @Input() certifier: CertifierAndOrganization;
  @Input() toxSummary: ToxSummary;

  constructor() { }

}
