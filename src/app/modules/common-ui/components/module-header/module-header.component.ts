import {Component, Input, OnInit} from '@angular/core';
import {ActivationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd)
    ).subscribe(
      {
        next: (event: any) => {
          if (event.snapshot.component !== undefined) {
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
}
