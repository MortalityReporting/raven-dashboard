import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private color: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  color$ = this.color.asObservable();
  private contrastColor: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  contrastColor$ = this.contrastColor.asObservable();

  constructor() { }

  setColor(color: string) {
    this.color.next(color);
  }
  setContrastColor(color: string) {
    this.contrastColor.next(color);
  }
}
