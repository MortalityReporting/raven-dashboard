import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {DecedentGridDTO} from "../../../model/decedent.grid.dto";
import {DecedentService} from "../../../service/decedent.service";
import {ActivatedRoute} from "@angular/router";
import { distinctUntilChanged, fromEvent, mergeMap, Subscription, tap, forkJoin, map} from "rxjs";
import { debounceTime } from "rxjs/operators";

interface ngOnDestroy {
}

@Component({
  selector: 'app-case-explorer',
  templateUrl: './case-explorer.component.html',
  styleUrls: ['./case-explorer.component.css']
})
export class CaseExplorerComponent implements OnInit, AfterViewInit, ngOnDestroy {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['personId', 'firstName', 'lastName', 'gender', 'age', 'tod'];
  totalCount: 0;
  decedentList: DecedentGridDTO[];
  isLoading = true;

  patientList: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  filterResultsObservable$: Subscription;
  loadDataObservable$: Subscription;
  private entryResult: [];



  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
  ) { }

  getDecedents(filter: string, sortOrder: string,  sortBy: string, pageNumber: number, pageSize: number): void {
    this.isLoading = true;
    this.loadDataObservable$ = this.decedentService.getCases(filter, sortOrder, sortBy, pageNumber, pageSize).subscribe(
      (response: any) => {
        this.decedentList = response.data;
        this.totalCount = response.count;
        this.dataSource = new MatTableDataSource<any>(this.decedentList);
        this.isLoading = false;
      }
    );



    this.decedentService.testCall().subscribe((bundle: any) => {

      bundle.entry.forEach(
         (entry: any, i: number) => {
              const decedent : any = {};
             decedent.id = entry?.resource?.id;
             decedent.firstName = entry?.resource?.name[0].given[0];
             decedent.lastName = entry?.resource?.name[0].family;
             decedent.gender = entry?.resource?.gender;
             decedent.dob = entry?.resource?.birthDate;
             decedent.age = this.calculateAge(new Date(entry?.resource?.birthDate));
             this.patientList.push(decedent);
             console.log(this.patientList);
           console.log(entry);
           this.decedentService.getDetails(entry).subscribe(
             (tod: any) => {
                   this.patientList[i].tod = tod;

             }
           )
         }
       );
    },
      (error)=> console.log(error),
      ()=>{ console.log(this.patientList); this.dataSource = new MatTableDataSource<any>(this.patientList)});
  }

  ngOnInit(): void {
    this.getDecedents(null, null, null, null, null);

    this.decedentService.getClinicalCases().pipe(
      mergeMap((clinicalCaseList: any[]) =>
        forkJoin(
          clinicalCaseList.map((clinicalCase: any) =>
            this.decedentService.getDetails(clinicalCase).pipe(
              map((tod: string) => {
                clinicalCase.resource.tod = tod;
                return clinicalCase;
              })
            )
          ))
      )
    ).subscribe((data: any) => {
      console.log(data);
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => {
      this.getDecedents(
        this.input.nativeElement.value,
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
    });

    this.filterResultsObservable$ = fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((text) => {
          this.getDecedents(
            this.input.nativeElement.value,
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        })
      ).subscribe();
  }

  ngOnDestroy(){
    this.filterResultsObservable$.unsubscribe();
    this.loadDataObservable$.unsubscribe();
  }

  onRowClicked(row: any) {
    console.log(row);
  }

  pageChanged(event: PageEvent) {
    this.getDecedents(
      this.input.nativeElement.value,
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  calculateAge(birthday: any) { // birthday is a daten calculateAge(birthday) { // birthday is a date
   const ageDifMs = Date.now() - birthday;
   const ageDate = new Date(ageDifMs);
   return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  private setActiveUser(data: any) {

  }
}
