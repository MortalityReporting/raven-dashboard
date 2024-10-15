import {Pipe, PipeTransform} from '@angular/core';
import {Registration} from "../models/registration";

@Pipe({
    standalone: true,
    name: 'sortByRegistrationStatus'
})
export class SortByRegistrationStatusPipe implements PipeTransform {
    constructor() {}

    transform(eventList: any[], registrations: any[], direction: 'asc'| 'desc' = 'asc'): any {
        // asc direction denotes registered last
        if (!eventList || !registrations) {
            return eventList;
        }
        eventList.sort((x, y) =>  {
            const xRegistered = registrations.some((registration: Registration) => registration.questionnaire.endsWith(x.fhirId));
            const yRegistered = registrations.some((registration: Registration) => registration.questionnaire.endsWith(y.fhirId));
            return direction == 'asc'? Number(xRegistered) - Number(yRegistered): Number(yRegistered) - Number(xRegistered)
        });
        return eventList;
    }
}
