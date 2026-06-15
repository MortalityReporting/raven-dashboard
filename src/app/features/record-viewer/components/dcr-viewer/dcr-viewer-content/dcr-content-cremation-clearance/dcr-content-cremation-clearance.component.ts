import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {CremationClearanceInfo} from "../../../../models/dcr-record";
import { MdiToEdrsViewerContentFieldComponent } from '../../../mdi-to-edrs-viewer/mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component';
import { SetFhirExplorerDirective } from '../../../../../fhir-explorer/directives/set-fhir-explorer.directive';

@Component({
    selector: 'app-dcr-content-cremation-clearance',
    templateUrl: './dcr-content-cremation-clearance.component.html',
    styleUrl: './dcr-content-cremation-clearance.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MdiToEdrsViewerContentFieldComponent, SetFhirExplorerDirective]
})
export class DcrContentCremationClearanceComponent {
  cremationClearanceInfo = input<CremationClearanceInfo>();
}
