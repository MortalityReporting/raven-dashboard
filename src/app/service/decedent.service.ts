import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Decedent} from "../model/decedent";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  constructor(private http: HttpClient) { }

  loadDecedentRecords(
    filter = '',
    sortOrder = 'asc',
    sortBy = 'personId',
    pageNumber = 0,
    pageSize = 10):  Observable<Decedent[]> {

    return this.http.get('/api/decedent-list', {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortBy', sortBy)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      map((result: any) => result.map((item: any) => Object.assign(new Decedent, item))
      )
    );
  }

  testCall():Observable<Decedent[]>{
    return this.http.get('/api/decedent-list').pipe(
      map((result: any) =>
        result.map((item: any) => Object.assign(new Decedent, item))
      )
    );
  }
}
