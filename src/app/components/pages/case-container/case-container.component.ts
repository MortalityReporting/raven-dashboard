import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDrawer} from "@angular/material/sidenav";
import {FhirExplorerDrawerService} from "../../../service/fhir-explorer-drawer.service";
import {FhirResourceProviderService} from "../../../service/fhir-resource-provider.service";
import {Observable} from "rxjs";
import {FhirResource} from "../../../model/fhir/fhir.resource";


@Component({
  selector: 'app-case-container',
  templateUrl: './case-container.component.html',
  styleUrls: ['./case-container.component.css']
})
export class CaseContainerComponent implements OnInit, AfterViewInit {

  @ViewChild('resultViewerSidenav') public drawer: MatDrawer;

  JSON: any; // TODO: For Testing, remove.
  fhirResource$: Observable<FhirResource>; // TODO: For Testing, remove.

  constructor(private route: ActivatedRoute,
              private fhirExplorerDrawerService: FhirExplorerDrawerService,
              private fhirResourceProvider: FhirResourceProviderService
  ) {
    this.JSON = JSON; // TODO: For Testing, remove.
    this.fhirResource$ = this.fhirResourceProvider.fhirResource$; // TODO: For Testing, remove.
  }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    this.fhirExplorerDrawerService.setDrawer(this.drawer);
  }

}
