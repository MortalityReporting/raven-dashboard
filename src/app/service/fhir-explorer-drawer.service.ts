import { Injectable } from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FhirExplorerDrawerService {

  private drawer: MatDrawer;
  private drawerStatus = new BehaviorSubject<boolean>(false);
  currentDrawerStatus = this.drawerStatus.asObservable();

  constructor() { }

  public setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  public open() {
    this.drawerStatus.next(true);
    return this.drawer.open();
  }

  public close() {
    this.drawerStatus.next(false);
    return this.drawer.close();
  }

  public toggle(): void {
    this.drawer.toggle();
    this.drawerStatus.next(this.drawer.opened);
  }

  public isInstantiated(): boolean{
    return !!this.drawer;
  }

  public destroy() {
    this.drawer = null;
  }

}
