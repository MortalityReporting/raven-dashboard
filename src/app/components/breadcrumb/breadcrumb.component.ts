import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

import { Breadcrumb } from '../../model/breadcrumb';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor( private breadcrumbService: BreadcrumbService ) {}

  ngOnInit(): void {
   this.breadcrumbService.breadcrumbs$.subscribe(value => this.breadcrumbs = value);
  }
}
