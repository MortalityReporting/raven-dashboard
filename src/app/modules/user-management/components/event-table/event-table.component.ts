import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {TestStatusDictionary} from "../../../testing-events"

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit {
  @Input() event: any;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  columnDictionary: {};

  TestStatusDictionary = TestStatusDictionary;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  };

  constructor() {}

  ngOnInit(): void {
    this.columnDictionary = this.event['cols'];
    this.displayedColumns = this.parseColKeys(this.event);
    this.dataSource = new MatTableDataSource<any>(this.event.rows)
  }

  capitalizeColumnHeader(column: string): string {
    return column.charAt(0).toUpperCase() + column.slice(1);
  }

  parseColKeys(event): string[] {
    const headers = event['cols'];
    let headerDisplays = ["user", "email"];
    for (const key in headers) {
      headerDisplays.push(key);
    }
    return headerDisplays;
  }
}