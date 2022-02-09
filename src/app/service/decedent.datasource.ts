import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";

import {catchError, finalize} from "rxjs/operators";
import {Decedent} from "../model/decedent";
import {DecedentService} from "./decedent.service";



export class DecedentDataSource implements DataSource<Decedent> {

  private decedentSubject = new BehaviorSubject<Decedent[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private decedentService: DecedentService) {

  }

  loadDecedents(filter:string,
              sortDirection:string,
              sortBy: string,
              pageIndex:number,
              pageSize:number) {

    this.loadingSubject.next(true);

    this.decedentService.loadDecedentRecords(filter, sortDirection, sortBy, pageIndex, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(decedents => this.decedentSubject.next(decedents));

  }

  connect(collectionViewer: CollectionViewer): Observable<Decedent[]> {
    console.log("Connecting data source");
    return this.decedentSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.decedentSubject.complete();
    this.loadingSubject.complete();
  }

}
