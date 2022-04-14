import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDrawer} from "@angular/material/sidenav";
import {FhirExplorerDrawer} from "../../../fhir-validator/providers/fhir-explorer-drawer";

@Component({
  selector: 'app-case-container',
  templateUrl: './case-container.component.html',
  styleUrls: ['./case-container.component.css']
})
export class CaseContainerComponent implements OnInit, AfterViewInit {

  @ViewChild('resultViewerSidenav') public drawer: MatDrawer;

  constructor(private route: ActivatedRoute,
              private fhirExplorerDrawer: FhirExplorerDrawer

  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    this.fhirExplorerDrawer.setDrawer(this.drawer);
  }

}
