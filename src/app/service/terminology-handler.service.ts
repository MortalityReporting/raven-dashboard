import { Injectable } from '@angular/core';
import { TrackingNumberVS } from "./mock-terminology/ValueSet-tracking-number-type";
import { MdiCodesCS } from "./mock-terminology/CodeSystem-mdi-codes";

@Injectable({
  providedIn: 'root'
})
export class TerminologyHandlerService {

  constructor() { }

  mapMdiCodeToDisplay(code: string): string {
    console.log(MdiCodesCS);
    let concept = MdiCodesCS.concept.find((concept: any) => concept.code === code);
    return concept.display;
  }
}
