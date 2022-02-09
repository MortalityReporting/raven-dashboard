import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {DecedentResponse} from "../model/decedent.response";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private http: HttpClient) { }

  getCases(
    filter = '',
    sortOrder = 'asc',
    sortBy = 'personId',
    pageNumber = 0,
    pageSize = 10):  Observable<DecedentResponse> {

    return this.http.get('/api/decedent-list', {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortBy', sortBy)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber)
        .set('pageSize', pageSize)
    }).pipe( map((result: any) => (
        result as DecedentResponse
      )),
      catchError((error: HttpErrorResponse) => throwError("The system was unable to generate new test: "
        + error.status + ". Report this error if it persists."
      ))
    );
  }

}
