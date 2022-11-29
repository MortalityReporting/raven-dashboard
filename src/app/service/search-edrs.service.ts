import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchEdrsService {

  private documentBundle = new Subject<any>();
  documentBundle$ = this.documentBundle.asObservable();

  constructor() { }

  setDocumentBundle(data): void {
    console.log(data);
    this.documentBundle.next(data);
  }

}
