import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {Decedent} from "../../../model/decedent";
import {DecedentService} from "../../../service/decedent.service";
import {DecedentDataSource} from "../../../service/decedent.datasource";
import {ActivatedRoute} from "@angular/router";
import {merge, fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators';

@Component({
  selector: 'app-case-explorer',
  templateUrl: './case-explorer.component.html',
  styleUrls: ['./case-explorer.component.css']
})
export class CaseExplorerComponent implements OnInit, AfterViewInit {

  decedent: Decedent;
  dataSource: DecedentDataSource;
  displayedColumns: string[] = ['personId', 'firstName', 'lastName', 'gender', 'age'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
  ) { }

  ngOnInit(): void {
    this.dataSource = new DecedentDataSource(this.decedentService);
    this.dataSource.loadDecedents('', 'asc', 'personId',0, 10);
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadDecedentsPage();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDecedentsPage())
      )
      .subscribe();

  }

  loadDecedentsPage() {
    this.dataSource.loadDecedents(
      this.input.nativeElement.value,
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }



  onRowClicked(row: any) {
    console.log(row);
  }
}
