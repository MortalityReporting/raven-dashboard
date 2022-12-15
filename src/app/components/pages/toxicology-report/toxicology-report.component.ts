import { Component, OnInit } from '@angular/core';
import {ToxicologyHandlerService} from "../../../service/toxicology-handler.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {FhirResourceProviderService} from "../../../service/fhir-resource-provider.service";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-toxicology-report',
  templateUrl: './toxicology-report.component.html',
  styleUrls: ['./toxicology-report.component.css']
})
export class ToxicologyReportComponent implements OnInit {

  messageBundle$: Observable<any>;
  toxHeader$: Observable<any>;
  sidenavExpanded = false;
  autosize: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxicologyHandlerService,
    private fhirResourceProvider: FhirResourceProviderService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    const path = "../../assets"
    this.matIconRegistry.addSvgIcon("labs", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/labs.svg`));
  }

  ngOnInit(): void {
    let toxLabId = this.route.snapshot.params['id'];
    this.messageBundle$ = this.toxicologyHandler.getMessageBundle(toxLabId);
    this.messageBundle$.subscribe(bundle => {
      this.fhirResourceProvider.setSelectedFhirResource(bundle);
      }
    );
    this.toxHeader$ = this.toxicologyHandler.toxHeader$;

  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {
    //this.caseSummaryContentComponent.onSetState(id, true);
  }
}
