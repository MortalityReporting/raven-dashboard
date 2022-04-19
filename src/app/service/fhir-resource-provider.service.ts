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

  constructor() {

  }

  setSelectedFhirResource(fhirResource: any) {
    console.log("Setting Selected FHIR Resource...");
    console.log(fhirResource);
    this.fhirResource.next(fhirResource);
  }
}
