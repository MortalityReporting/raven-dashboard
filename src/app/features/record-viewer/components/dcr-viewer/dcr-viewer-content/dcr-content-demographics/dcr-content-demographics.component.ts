import {Component, input, Input, ChangeDetectionStrategy} from '@angular/core';
import {Demographics} from "../../../../models/case.summary";
import { MdiToEdrsViewerContentFieldComponent } from '../../../mdi-to-edrs-viewer/mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component';
import { SetFhirExplorerDirective } from '../../../../../fhir-explorer/directives/set-fhir-explorer.directive';

@Component({
    selector: 'app-dcr-content-demographics',
    templateUrl: './dcr-content-demographics.component.html',
    styleUrl: './dcr-content-demographics.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MdiToEdrsViewerContentFieldComponent, SetFhirExplorerDirective]
})
export class DcrContentDemographicsComponent {
  demographics = input<Demographics>();
}
