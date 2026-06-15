import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {CertifierAndOrganization, ToxSummary} from "../../../models/tox.summary";
import { SetFhirExplorerDirective } from '../../../../fhir-explorer/directives/set-fhir-explorer.directive';
import { ToxToMdiViewerGridSectionComponent } from '../tox-to-mdi-viewer-grid-section/tox-to-mdi-viewer-grid-section.component';

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-certifier',
    templateUrl: './tox-to-mdi-viewer-certifier.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SetFhirExplorerDirective, ToxToMdiViewerGridSectionComponent]
})
export class ToxToMdiViewerCertifierComponent {
  @Input() certifier: CertifierAndOrganization;
  @Input() toxSummary: ToxSummary;

  constructor() { }

}
