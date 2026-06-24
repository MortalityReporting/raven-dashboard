import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, single} from "rxjs";
import {Bundle, FhirClientService, FhirResource, QuestionnaireResponse} from "../../fhir-util";
import {EventModule} from "../models/event-module";
import {DashboardApiInterfaceService} from "../../dashboard-api";
import {Registration} from "../models/registration";
import {HttpEvent} from "@angular/common/http";
import {UpdateAction} from "../models/update-action";

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
    return this.dashboardApi.uploadFile(file, event);
  }

  // attachment is in the form of "{event_or_bucket_name}/{file_name}" as it appears in the valueAttachment field of a resource or in the admin panel return.
  getAttachment(attachment: string) {
    const split = attachment.split("/");
    console.log(split)
    return this.dashboardApi.getDocument(split[0], split[1])
  }

  updateTestStatus(registration: Registration, linkId: string, data: UpdateAction): Observable<FhirResource> {
    let itemToUpdate = registration.item.find(item => item.linkId === linkId);
    itemToUpdate.answer[0].valueCoding.code = data.status;
    // TODO: Add attachment extension here.
    if (data.attachment !== undefined) {
      itemToUpdate.extension = [{
        "url": "attachment",
          "valueAttachment": {
            "url": data.attachment
          }
        }]
    }
    //registration.updateStatus(linkId, newStatus); // TODO: Figure out why this method doesn't work.
    console.log(registration);
    return this.fhirClient.update("QuestionnaireResponse", registration);
  }

}
