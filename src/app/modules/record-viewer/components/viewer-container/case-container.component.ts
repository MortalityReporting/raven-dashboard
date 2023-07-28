import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDrawer} from "@angular/material/sidenav";
import {FhirExplorerDrawerService} from "../../../fhir-explorer/services/fhir-explorer-drawer.service";
import {Subscription} from "rxjs";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";

@Component({
  selector: 'record-viewer-case-container',
  templateUrl: './case-container.component.html',
  styleUrls: ['../../record-viewer-styles.scss']
})
export class CaseContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawer') public drawer: MatDrawer;
  drawerWidth = "30%"
  drawerCollapsed = true;
  drawerStatus$: Subscription;
  currentRoute: string;

  constructor(private route: ActivatedRoute,
              private fhirExplorerDrawerService: FhirExplorerDrawerService,
              @Inject('config') public config: ModuleHeaderConfig,
  ) {
    route.url.subscribe(url => {
      this.currentRoute = url[0].path;
    });
  }

  ngOnInit(): void {
    this.drawerStatus$ = this.fhirExplorerDrawerService.currentDrawerStatus.subscribe(
      (drawerOpened) => {
        if(!drawerOpened){
          this.drawerWidth = "30%";
          this.drawerCollapsed = true;
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.fhirExplorerDrawerService.setDrawer(this.drawer);
  }

  ngOnDestroy(): void {
    this.fhirExplorerDrawerService.destroy();
    this.drawerStatus$.unsubscribe();
  }

  setDrawerWidth(drawerWidth: string): void {
    this.drawerCollapsed = !this.drawerCollapsed;
    this.drawerWidth = drawerWidth;
  }


  scrollToTop() {
    document.getElementById("anchorTop").scrollIntoView({behavior: "smooth"});
  }
}
