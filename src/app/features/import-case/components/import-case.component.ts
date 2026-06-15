import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {FileTemplate} from "../models/file-template";
import {FileTemplateService} from "../services/file-template.service";
import {MatTabsModule} from "@angular/material/tabs";
import {ImportCaseFhirRecordComponent} from "./import-case-fhir-record/import-case-fhir-record.component";
import {ImportCaseConnectathonTemplateComponent} from "./import-case-connectathon-template/import-case-connectathon-template.component";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {FileTemplateComponent} from "./file-template/file-template.component";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-import-case',
    templateUrl: './import-case.component.html',
    styleUrls: ['./import-case.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatTabsModule,
        ImportCaseFhirRecordComponent,
        ImportCaseConnectathonTemplateComponent,
        MatCardModule,
        MatRadioModule,
        FormsModule,
        MatDividerModule,
        FileTemplateComponent,
    ]
})

export class ImportCaseComponent {
  fileTemplateService = inject(FileTemplateService);
  inputOptions: string[] = ['MDI FHIR Bundle', 'Template Spreadsheet'];
  selectedInputOption: string = this.inputOptions[0];
  fileTemplate = toSignal<FileTemplate[], FileTemplate[]>(this.fileTemplateService.getFileTemplates(), { initialValue: [] });

}
