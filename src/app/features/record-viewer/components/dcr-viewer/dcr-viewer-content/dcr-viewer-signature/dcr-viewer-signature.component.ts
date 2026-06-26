import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {SignatureBlock} from "../../../../models/dcr-record";
import { MdiToEdrsViewerContentFieldComponent } from '../../../mdi-to-edrs-viewer/mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component';
import { SetFhirExplorerDirective } from '../../../../../fhir-explorer/directives/set-fhir-explorer.directive';

@Component({
    selector: 'app-dcr-viewer-signature',
    templateUrl: './dcr-viewer-signature.component.html',
    styleUrls: ['./dcr-viewer-signature.component.css',
        '../../../mdi-to-edrs-viewer/mdi-to-edrs-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MdiToEdrsViewerContentFieldComponent, SetFhirExplorerDirective]
})
export class DcrViewerSignatureComponent {
  signature = input<SignatureBlock>()
}
