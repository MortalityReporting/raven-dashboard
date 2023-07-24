import { Injectable } from '@angular/core';
import {map, Observable, single} from "rxjs";
import {Bundle, FhirClientService, FhirResource} from "../../fhir-util";
import {EventModule} from "../models/event-module";
import {EventRegistration} from "../models/event-registration";

@Injectable({
  providedIn: 'root'
})
export class EventModuleManagerService {

  constructor(private fhirClient: FhirClientService) { }

  getAllEvents(): Observable<EventModule[]> {
    return this.fhirClient.search("Questionnaire", "", true).pipe(
      map((results: FhirResource[] | Bundle) => {
        let events: EventModule[] = [];
        (results as FhirResource[])?.map(
          (entry: any) => events.push(EventModule.constructFromFHIR(entry))
        );
        return events;
      }),
      single()
    );
  }

  getAllRegistrations(fhirId: string, eventModules: EventModule[]): Observable<EventRegistration[]> {
    return this.fhirClient.search("QuestionnaireResponse", `?subject=Practitioner/${fhirId}`, true).pipe(
      map((results: FhirResource[] | Bundle) => {
        let registrations: EventRegistration[] = [];
        (results as FhirResource[])?.map(
          (entry: any) => registrations.push(EventRegistration.constructFromFHIR(entry, eventModules))
        );
        return registrations;
      }),
      single()
    );
  }
}
