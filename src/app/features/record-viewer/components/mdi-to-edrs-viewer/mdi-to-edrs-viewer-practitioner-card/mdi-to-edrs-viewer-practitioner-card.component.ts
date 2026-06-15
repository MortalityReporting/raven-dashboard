import {Component, Input} from '@angular/core';
import {Author} from "../../../models/case.header";
import { MdiToEdrsViewerContentFieldComponent } from '../mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component';
import { SetFhirExplorerDirective } from '../../../../fhir-explorer/directives/set-fhir-explorer.directive';

@Component({
    selector: 'record-viewer-mdi-to-edrs-viewer-practitioner-card',
    templateUrl: './mdi-to-edrs-viewer-practitioner-card.component.html',
    styleUrls: ['../mdi-to-edrs-viewer.component.scss'],
    imports: [MdiToEdrsViewerContentFieldComponent, SetFhirExplorerDirective]
})
export class MdiToEdrsViewerPractitionerCardComponent {
  @Input() practitioner: Author;

}
