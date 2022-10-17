import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {DocumentHandlerService} from "./document-handler.service";
import {FhirResource} from "../model/fhir/fhir.resource";

@Injectable({
  providedIn: 'root'
})
export class FhirResourceProviderService {

  private fhirResource = new Subject<FhirResource>();
  fhirResource$ = this.fhirResource.asObservable();

  compositionId: string;

  constructor() {

  }

  setCompositionId( compositionId: string )
  {
    this.compositionId = compositionId;
  }

  setSelectedFhirResource(fhirResource: any) {
    this.fhirResource.next(fhirResource);
  }
}
