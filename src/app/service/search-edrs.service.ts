import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {DecedentSimpleInfo} from "../model/decedent-simple-info";

@Injectable({
  providedIn: 'root'
})
export class SearchEdrsService {

  private documentBundle = new Subject<any>();
  documentBundle$ = this.documentBundle.asObservable();

  private decedentData = new Subject<DecedentSimpleInfo>();
  decedentData$ = this.decedentData.asObservable();

  constructor() { }

  setDocumentBundle(data): void {
    this.documentBundle.next(data);
  }

  setDecedentData(data: DecedentSimpleInfo): void {
    this.decedentData.next(data);
  }

}
