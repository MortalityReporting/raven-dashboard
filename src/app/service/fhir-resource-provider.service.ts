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

  compostionId: string;

  constructor() {

  }

  setCompositionId( compositionId: string )
  {    
    this.compostionId = compositionId;
  }

  setSelectedFhirResource(fhirResource: any) {
    this.fhirResource.next(fhirResource);
  }
}
