import {Component, Input} from '@angular/core';
import {ToxDemographics} from "../../../models/tox.summary";
import { MdiToEdrsViewerContentFieldComponent } from '../../mdi-to-edrs-viewer/mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component';
import { SetFhirExplorerDirective } from '../../../../fhir-explorer/directives/set-fhir-explorer.directive';

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-demographics',
    templateUrl: './tox-demo-card.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    imports: [MdiToEdrsViewerContentFieldComponent, SetFhirExplorerDirective]
})
export class ToxDemoCardComponent {
  @Input() demographics: ToxDemographics;

}
