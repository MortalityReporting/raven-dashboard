import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Router} from "@angular/router";
import {ModuleHeaderService} from "../../service/module-header.service";
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';

@Component({
    selector: 'app-module-header',
    templateUrl: './module-header.component.html',
    styleUrls: ['./module-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [BreadcrumbComponent, MatIcon, MatDivider]
})
export class ModuleHeaderComponent implements OnInit {

  @Input() moduleDetails: any;
  showHeader: boolean = false;
  moduleTitle = undefined;
  componentTitle = undefined;
  backgroundColor = undefined;
  icon = undefined;

  constructor(private router: Router,
              private moduleHeaderService: ModuleHeaderService
  ) { }

  ngOnInit(): void {
    this.moduleHeaderService.moduleHeaderConfig$.subscribe(value => {
      this.showHeader = value.showHeader;
      this.moduleTitle = value.moduleTitle;
      this.backgroundColor = value.backgroundColor;
      this.componentTitle = value.componentTitle;
      this.icon = value.icon;
    });
  }

}
