import { Injectable } from '@angular/core';
import {FhirResource} from "../models/fhir/r4/base/fhir.resource";
import {SUPPORTED_RESOURCE_TYPES} from "../index";
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FhirModelTranslationService {

  constructor() {}

  // Placeholder for generic translation to FHIR.
  toFhir(data, resourceType:string, mapping: {}): FhirResource {
    if (!(resourceType in SUPPORTED_RESOURCE_TYPES)) {
      throwError(() => new Error("Resource Type Not Supported."));
    }

    let resource: FhirResource = {resourceType: resourceType}

    return resource;
  }

  // Placeholder for generic translation from FHIR.
  fromFhir(resource: FhirResource, mapping: {}): any {
    let object = {};

    return object;
  }
}
