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
    filter?: string,
    sortOrder?: string,
    sortBy?: string,
    pageNumber?: number,
    pageSize?: number):  Observable<DecedentResponse> {

    const filterParam: string = filter || '';
    const sortOrderParam: string = sortOrder || 'asc';
    const sortByParam: string = sortBy || 'personId';
    const pageNumberParam: number = pageNumber || 0;
    const pageSizePram: number = pageSize || 10;

    return this.http.get('/api/decedent-list', {
      params: new HttpParams()
        .set('filter', filterParam)
        .set('sortBy', sortByParam)
        .set('sortOrder', sortOrderParam)
        .set('pageNumber', pageNumberParam)
        .set('pageSize', pageSizePram)
    }).pipe( map((result: any) => (
        result as DecedentResponse
      )),
      catchError((error: HttpErrorResponse) => throwError("The system was unable to generate new test: "
        + error.status + ". Report this error if it persists."
      ))
    );
  }

}
