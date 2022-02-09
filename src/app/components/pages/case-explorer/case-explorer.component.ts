import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {Decedent} from "../../../model/decedent";
import {DecedentService} from "../../../service/decedent.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-case-explorer',
  templateUrl: './case-explorer.component.html',
  styleUrls: ['./case-explorer.component.css']
})
export class CaseExplorerComponent implements OnInit, AfterViewInit {

  decedent: Decedent;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['personId', 'firstName', 'lastName', 'gender', 'age'];
  totalCount: 0;

  decedentList: Decedent[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
  ) { }

  getDecedents(filter: string, sortOrder: string='asc',  sortBy: string = 'personId', pageNumber: number = 1, pageSize: number = 10): void {
    this.decedentService.getCases(filter, sortOrder, sortBy, pageNumber, pageSize).subscribe(
      (response: any) => {
        this.decedentList = response.data;
        this.totalCount = response.count;
        this.dataSource = new MatTableDataSource<any>(this.decedentList);
      }
    );
  }

  ngOnInit(): void {
    this.getDecedents("", 'asc', 'personId', 1,  10);
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
}
