import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {DecedentService} from "../../../service/decedent.service";
import {DocumentHandlerService} from "../../../service/document-handler.service";

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.css']
})
export class CaseSummaryComponent implements OnInit {

  documentBundle: any;

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    private documentHandler: DocumentHandlerService
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
    this.decedentService.getComposition(subjectId).subscribe({
      next: (data) => {
        this.decedentService.getDocumentBundle(data.entry[0].resource.id).subscribe({
          next: (document) => {
            console.log(document);
            this.documentBundle = document
          }
        })
      }
    });
  }

  // TODO: REFACTOR THIS IT'S REALLY BAD
  getPatientOfficialName() {
    return this.documentHandler.getPatientOfficialName(this.documentBundle);
  }
}
