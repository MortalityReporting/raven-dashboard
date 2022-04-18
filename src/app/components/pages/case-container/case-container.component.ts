import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDrawer} from "@angular/material/sidenav";
import {FhirExplorerDrawerService} from "../../../service/fhir-explorer-drawer.service";


@Component({
  selector: 'app-case-container',
  templateUrl: './case-container.component.html',
  styleUrls: ['./case-container.component.css']
})
export class CaseContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(private route: ActivatedRoute,
              private fhirExplorerDrawerService: FhirExplorerDrawerService
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    this.fhirExplorerDrawerService.setDrawer(this.drawer);
  }

  ngOnDestroy(): void {
    this.fhirExplorerDrawerService.destroy();
  }

}
