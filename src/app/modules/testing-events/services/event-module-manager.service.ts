import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, single} from "rxjs";
import {Bundle, FhirClientService, FhirResource} from "../../fhir-util";
import {EventModule} from "../models/event-module";
import {EventRegistration} from "../models/event-registration";
import {QuestionnaireResponse} from "../../fhir-util/models/resources/questionnaireResponse";
import {TestStatus} from "../models/test-status";
import {DashboardApiInterfaceService} from "../../../service/dashboard-api-interface.service";

@Injectable({
  providedIn: 'root'
})
export class EventModuleManagerService {

  currentRegistration = new BehaviorSubject<EventRegistration>(undefined);
  currentRegistration$ = this.currentRegistration.asObservable();

  constructor(private fhirClient: FhirClientService, private dashboardApi: DashboardApiInterfaceService) { }

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

  setCurrentlySelectedRegistration(eventRegistration: EventRegistration) {
    this.currentRegistration.next(eventRegistration);
  }

  createNewRegistration(questionnaireResponse: QuestionnaireResponse): Observable<any> {
    //TODO: Move to Dashboard API
    return this.fhirClient.create("QuestionnaireResponse", questionnaireResponse);
  }

  uploadDocument(file: File, userId: string, registrationId: string): Observable<any> {
    console.log("uppies")
    const upload$ = this.dashboardApi.uploadFile(file, userId, registrationId).pipe();
    const combined$ = combineLatest([upload$, this.currentRegistration$]).pipe(
      map(value => {
        console.log(value)
        return value[0]
      })
    )
    return combined$;
  }

  updateTestStatus(resource: QuestionnaireResponse, linkId: string, newStatus: TestStatus): Observable<any> {
    //TODO: Move to Dashboard API
    const index = resource.item.findIndex((item: any) => item["linkId"] === linkId);
    resource.item[index]["answer"][0].valueCoding.code = newStatus;
    return this.fhirClient.update("QuestionnaireResponse", resource)
  }

}
