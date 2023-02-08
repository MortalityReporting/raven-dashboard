import {Component, Input, OnInit} from '@angular/core';
import {ToxSummary} from "../../../models/tox.summary";
import {ToxicologyHandlerService} from "../../../services/toxicology-handler.service";
import {Observable} from "rxjs";

@Component({
  selector: 'record-viewer-toxicology-report-mdi-case',
  templateUrl: './toxicology-report-mdi-case.component.html',
  styleUrls: ['../toxicology-report.component.scss']
})
export class ToxicologyReportMdiCaseComponent implements OnInit {
  @Input() toxSummary: ToxSummary;
  relatedCaseAvailable = false;

  constructor(
    private toxHandler: ToxicologyHandlerService
  ) { }

  ngOnInit(): void {
    this.toxHandler.isRelatedMdiDocumentAvailable(this.toxSummary.patientId).subscribe(
      (result => {
        this.relatedCaseAvailable = result;
      })
    );
  }

}
