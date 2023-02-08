import { Injectable } from '@angular/core';
import { TrackingNumberVS } from "../../service/mock-terminology/ValueSet-tracking-number-type";
import { MdiCodesCS } from "../../service/mock-terminology/CodeSystem-mdi-codes";

@Injectable({
  providedIn: 'root'
})
export class TerminologyHandlerService {

  constructor() { }

  mapMdiCodeToDisplay(code: string): string {
    let concept = MdiCodesCS.concept.find((concept: any) => concept.code === code);
    return concept.display;
  }
}
