import {Component, input} from '@angular/core';
import {CaseAdminInfo} from "../../../../models/dcr-record";
import { MdiToEdrsViewerContentFieldComponent } from '../../../mdi-to-edrs-viewer/mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component';
import { SetFhirExplorerDirective } from '../../../../../fhir-explorer/directives/set-fhir-explorer.directive';


@Component({
    selector: 'app-dcr-content-case-admin-info',
    templateUrl: './dcr-content-case-admin-info.component.html',
    styleUrl: './dcr-content-case-admin-info.component.css',
    imports: [MdiToEdrsViewerContentFieldComponent, SetFhirExplorerDirective]
})
export class DcrContentCaseAdminInfoComponent{
  caseAdminInfo = input<CaseAdminInfo>()
}
