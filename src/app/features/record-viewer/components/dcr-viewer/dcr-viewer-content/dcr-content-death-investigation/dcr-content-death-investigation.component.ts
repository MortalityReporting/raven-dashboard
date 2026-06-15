import {Component, input} from '@angular/core';
import {DeathInvestigation} from "../../../../models/dcr-record";
import { MdiToEdrsViewerContentFieldComponent } from '../../../mdi-to-edrs-viewer/mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component';
import { SetFhirExplorerDirective } from '../../../../../fhir-explorer/directives/set-fhir-explorer.directive';

@Component({
    selector: 'app-dcr-content-death-investigation',
    templateUrl: './dcr-content-death-investigation.component.html',
    styleUrl: './dcr-content-death-investigation.component.css',
    imports: [MdiToEdrsViewerContentFieldComponent, SetFhirExplorerDirective]
})
export class DcrContentDeathInvestigationComponent{
  deathInvestigation = input<DeathInvestigation>();
}
