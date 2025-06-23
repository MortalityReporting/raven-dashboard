import {Component, OnInit, signal} from '@angular/core';
import { Observable } from 'rxjs';

import { Breadcrumb } from '../../model/breadcrumb';
import { BreadcrumbService } from '../../service/breadcrumb.service';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: false
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor( private breadcrumbService: BreadcrumbService ) {}

  ngOnInit(): void {
   this.breadcrumbService.breadcrumbs$.subscribe(value => this.breadcrumbs = value);
  }
}
