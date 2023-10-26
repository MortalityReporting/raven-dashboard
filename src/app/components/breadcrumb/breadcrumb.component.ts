import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Breadcrumb } from '../../model/breadcrumb';
import { BreadcrumbService } from '../../service/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor( private breadcrumbService: BreadcrumbService ) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
