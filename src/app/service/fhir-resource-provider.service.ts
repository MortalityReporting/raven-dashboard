import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {DocumentHandlerService} from "../modules/record-viewer/services/document-handler.service";
import {FhirResource} from "../modules/fhir-util/models/fhir.resource";

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
