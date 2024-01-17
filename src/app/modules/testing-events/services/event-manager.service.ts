import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, of, single} from "rxjs";
import {Bundle, FhirClientService, FhirResource, QuestionnaireResponse} from "../../fhir-util";
import {EventModule} from "../models/event-module";
import {DashboardApiInterfaceService} from "../../dashboard-api";
import {Registration} from "../models/registration";
import {TestStatusCodes} from "../models/test-status";
import {HttpEvent} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {

  private currentEvent = new BehaviorSubject<EventModule>(undefined);
  currentEvent$ = this.currentEvent.asObservable();
  private currentRegistration = new BehaviorSubject<Registration>(undefined);
  currentRegistration$ = this.currentRegistration.asObservable();

  constructor(private fhirClient: FhirClientService, private dashboardApi: DashboardApiInterfaceService) {

  }

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

  getAllRegistrations(fhirId: string, eventModules: EventModule[]): Observable<Registration[]> {
    return this.fhirClient.search("QuestionnaireResponse", `?subject=Practitioner/${fhirId}`, true).pipe(
      map((results: FhirResource[] | Bundle) => {
        let registrations: Registration[] = [];
        (results as FhirResource[])?.map(
          (entry: any) => registrations.push(entry)
        );
        return registrations;
      }),
      single()
    );
  }

  matchRegistrationToEvent(registration: Registration, eventModules: EventModule[]): EventModule {
    return eventModules.find((eventModule: EventModule) => registration.questionnaire.endsWith(eventModule.fhirId));
  }

  setCurrentEvent(eventModule: EventModule) { this.currentEvent.next(eventModule); }
  setCurrentRegistration(eventRegistration: Registration) { this.currentRegistration.next(eventRegistration); }

  createNewRegistration(questionnaireResponse: QuestionnaireResponse): Observable<any> {
    //TODO: Move to Dashboard API
    return this.fhirClient.create("QuestionnaireResponse", questionnaireResponse);
  }

  getUserEventRegistrationById(userEventRegistrationId: string): Observable<any> {
    return this.fhirClient.read("QuestionnaireResponse", userEventRegistrationId);
  }

  uploadDocument(file: File, event: string): Observable<HttpEvent<any>> {
    // Note: User is inferred from token.
    const upload$ = this.dashboardApi.uploadFile(file, event);
    return upload$;
    // return combineLatest([upload$, this.currentRegistration$]).pipe(
    //   map(value => {
    //     console.log(value)
    //     return value[1]
    //   })
    // );
  }

  updateTestStatus(registration: Registration, linkId: string, newStatus: TestStatusCodes): Observable<FhirResource> {
    let itemToUpdate = registration.item.find(item => item.linkId === linkId);
    itemToUpdate.answer[0].valueCoding.code = newStatus;
    //registration.updateStatus(linkId, newStatus); // TODO: Figure out why this method doesn't work.
    console.log(registration);
    return this.fhirClient.update("QuestionnaireResponse", registration);
  }

  // updateTestStatus(resource: QuestionnaireResponse, linkId: string, newStatus: TestStatus, attachment?: FhirResource, attachmentComment?: string): Observable<any> {
  //   //TODO: Move to Dashboard API
  //   const index = resource.item.findIndex((item: any) => item["linkId"] === linkId);
  //   resource.item[index]["answer"][0].valueCoding.code = newStatus;
  //   if (attachment) {
  //     let reference: Reference = {"reference": `${attachment["resourceType"]}/${attachment["id"]}`}
  //     if (attachmentComment) {
  //       reference["display"] = attachmentComment;
  //     }
  //     const attachmentAnswer: QuestionnaireResponseItemAnswer = {
  //       "valueReference": reference
  //     }
  //     resource.item[index]["answer"].push(attachmentAnswer);
  //   }
  //   return this.fhirClient.update("QuestionnaireResponse", resource);
  // }

  // updateTestStatus(linkId: string, newStatus: TestStatus, attachment?: DocumentReference): Observable<any> {
  //   console.log(attachment);
  //   return this.currentRegistration$.pipe(
  //     map((registrationResource: Registration) => {
  //       let registration = registrationResource;
  //       console.log(registration);
  //       let item = registration.items.find(item => item.linkId === linkId);
  //       item.setStatus(newStatus);
  //       item.setAttachment(`${attachment["resourceType"]}/${attachment["id"]}`);
  //       let questionnaireResponse = registration.toFhir();
  //       return this.fhirClient.update("QuestionnaireResponse", questionnaireResponse)
  //     })
  //   )
  //
  // }

}
