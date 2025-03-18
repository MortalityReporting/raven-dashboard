import { Injectable } from '@angular/core';
import {ActivationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {Subject} from "rxjs";
import {ModuleHeaderConfig} from "../model/model-header-config";

@Injectable({
  providedIn: 'root'
})
export class ModuleHeaderService {

  private moduleHeaderConfig = new Subject<ModuleHeaderConfig>();
  moduleHeaderConfig$ = this.moduleHeaderConfig.asObservable();
  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event) =>  event instanceof ActivationEnd)
    ).subscribe(
      {
        next: (activationEndEvent: any) => {
          if (activationEndEvent.snapshot?.data !== undefined && Object.keys(activationEndEvent.snapshot.data).length !== 0) {
            const value = {
              showHeader: !!(activationEndEvent.snapshot?.data?.moduleConfig),
              moduleTitle: activationEndEvent.snapshot?.data?.moduleConfig?.title ?? null,
              componentTitle: activationEndEvent.snapshot?.data?.componentTitle ?? null,
              backgroundColor: activationEndEvent.snapshot?.data?.moduleConfig?.backgroundColor ?? null,
              icon: activationEndEvent.snapshot?.data?.moduleConfig?.icon ?? null,
            }
            this.moduleHeaderConfig.next(value);
          }
        }
      }
    );

  }
}
