import {Component, Input, OnInit} from '@angular/core';
import {ActivationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {FhirExplorerDrawerService} from "../../../fhir-explorer/services/fhir-explorer-drawer.service";

@Component({
  selector: 'app-module-header',
  templateUrl: './module-header.component.html',
  styleUrls: ['./module-header.component.css']
})
export class ModuleHeaderComponent implements OnInit {

  @Input() moduleDetails: any;
  showHeader: boolean = false;
  moduleTitle = undefined;
  componentTitle = undefined;
  backgroundColor = undefined;
  icon = undefined;

  constructor(private router: Router,
              public fhirExplorerDrawerService: FhirExplorerDrawerService,
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => {return event instanceof ActivationEnd})
    ).subscribe(
      {
        next: (event: any) => {
          if (event.snapshot.data !== undefined && Object.keys(event.snapshot.data).length !== 0) {
            console.log("EVENT")
            console.log(event)
            console.log(event.snapshot.data)
            this.showHeader = !!(event.snapshot.data.moduleConfig);
            this.moduleTitle = event.snapshot.data.moduleConfig?.title || undefined;
            this.backgroundColor = event.snapshot.data.moduleConfig?.backgroundColor || undefined;
            this.componentTitle = event.snapshot.data.componentTitle || undefined;
            this.icon = event.snapshot.data.moduleConfig?.icon || undefined;
          }
        }
      }
    );
  }
  onToggle() {
    this.fhirExplorerDrawerService.toggle();
  }
}
