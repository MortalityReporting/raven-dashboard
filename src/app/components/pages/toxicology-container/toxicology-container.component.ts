import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {FhirExplorerDrawerService} from "../../../service/fhir-explorer-drawer.service";

@Component({
  selector: 'app-toxicology-container',
  templateUrl: './toxicology-container.component.html',
  styleUrls: ['./toxicology-container.component.css']
})
export class ToxicologyContainerComponent implements OnInit {

  @ViewChild('drawer') public drawer: MatDrawer;
  drawerWidth = "30%"
  drawerCollapsed = true;
  drawerStatus$: Subscription;

  constructor(private route: ActivatedRoute,
              private fhirExplorerDrawerService: FhirExplorerDrawerService
  ) { }

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
