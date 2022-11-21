import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ValidationResults} from "../domain/ValidationResults";

@Injectable({
  providedIn: 'root'
})

export class FhirValidatorStateService {
  private fhirResource = new Subject<any>();
  private validationResults = new Subject<ValidationResults>();
  private resourcePasted = new Subject<boolean>();

  setValidationResults(value: ValidationResults){
    this.validationResults.next(value);
  }

  setFhirResource(value: any){
    this.fhirResource.next(value);
  }

  getFhirResource(): Observable<any>{
    return this.fhirResource.asObservable();
  }

  getValidationResults() : Observable<ValidationResults>{
    return this.validationResults.asObservable();
  }

  isResourcePasted(): Observable<boolean>{
    return this.resourcePasted.asObservable();
  }

  setResourcePasted(value: boolean){
    return this.resourcePasted.next(value);
  }
}
