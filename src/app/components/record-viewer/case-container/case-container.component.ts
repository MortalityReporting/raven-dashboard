import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDrawer} from "@angular/material/sidenav";
import {FhirExplorerDrawerService} from "../../../service/fhir-explorer-drawer.service";
import {Subscription} from "rxjs";


class DrawerService {
}

@Component({
  selector: 'app-case-container',
  templateUrl: './case-container.component.html',
  styleUrls: ['./case-container.component.scss']
})
export class CaseContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawer') public drawer: MatDrawer;
  drawerWidth = "30%"
  drawerCollapsed = true;
  drawerStatus$: Subscription;
  currentRoute: string;

  constructor(private route: ActivatedRoute,
              private fhirExplorerDrawerService: FhirExplorerDrawerService
  ) {
    route.url.subscribe(url => {
      this.currentRoute = url[1].path;
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
}
