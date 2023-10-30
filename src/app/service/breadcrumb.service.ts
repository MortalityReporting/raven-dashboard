import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {ModuleHeaderService} from "./module-header.service";
import {Breadcrumb} from "../model/breadcrumb";

export interface RouterNaviEndValue{
  header?: boolean | null,
  moduleTitle?: string | null,
  componentTitle?: string | null,
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router,
              private moduleHeaderService: ModuleHeaderService) {

    moduleHeaderService.moduleHeaderConfig$.subscribe(moduleHeaderConfig => {
      const root = this.router.routerState.snapshot.root;
      this._breadcrumbs$.next(this.getBreadcrumbNew(root.firstChild, moduleHeaderConfig));
    })
  }
  private getBreadcrumbNew(route: ActivatedRouteSnapshot, routerNaviEndValue: RouterNaviEndValue): Breadcrumb[] {
    let breadcrumbs: Breadcrumb[] = []
    let url = this.router.routerState.snapshot.url;
    let components = url.split('/');

    if (components.filter(item => !!item.length).length > 0) {
      breadcrumbs = components.map((item, index) => {
        let url = ''
        if (index === 0) { //build home breadcrumb
          return {label: 'Home', url: url};
        } else if (index === 1 && routerNaviEndValue.moduleTitle) {
          return {label: routerNaviEndValue.moduleTitle, url: url + '/' + item}
        } else if (index === 2 && routerNaviEndValue.moduleTitle) {
          return {label: routerNaviEndValue.componentTitle, url: url + '/' + item}
        } else return null;
      })
        .filter(element => element != null);
    }

    return breadcrumbs
  }

}
