import {Component, OnInit, ViewChild} from '@angular/core';
import {ToxicologyHandlerService} from "../../services/toxicology-handler.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, tap} from "rxjs";
import {FhirResourceProviderService} from "../../../../service/fhir-resource-provider.service";
import {ToxHeader} from "../../models/tox.header";
import {ToxSummary} from "../../models/tox.summary";
import {CaseSummaryContentComponent} from "../case-summary/case-summary-content/case-summary-content.component";
import {ToxicologyReportContentComponent} from "./toxicology-report-content/toxicology-report-content.component";

@Component({
  selector: 'record-viewer-toxicology-report',
  templateUrl: './toxicology-report.component.html',
  styleUrls: ['../../record-viewer-styles.scss', './toxicology-report.component.scss']
})
export class ToxicologyReportComponent implements OnInit {
  @ViewChild(CaseSummaryContentComponent) toxReportContentComponent: ToxicologyReportContentComponent;

  messageBundle$: Observable<any>;
  toxHeader: ToxHeader;
  toxSummary: ToxSummary;

  sidenavExpanded = false;
  autosize: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxicologyHandlerService,
    private fhirResourceProvider: FhirResourceProviderService
  ) {}

  ngOnInit(): void {
    let toxLabId = this.route.snapshot.params['id'];
    this.messageBundle$ = this.toxicologyHandler.getMessageBundle(toxLabId);
    this.messageBundle$.subscribe(bundle => {
      this.fhirResourceProvider.setSelectedFhirResource(bundle);
      this.toxHeader = this.toxicologyHandler.constructToxHeaderHeader(bundle);
      this.toxSummary = this.toxicologyHandler.constructToxSummary(bundle);
      }
    );
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    this.toxReportContentComponent.onSetState(id, true);
  }
}
