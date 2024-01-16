import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {TestStatusDictionary} from "../../../testing-events"
import {openConfirmationDialog} from "ngx-hisb-common-ui";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnChanges {
  @Input() testingEvent: any;
  @Output() testingEventUpdated =
    new EventEmitter<{userEventRegistrationId: string, currentItemLinkId: string}>()

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  columnDictionary: {};

  TestStatusDictionary = TestStatusDictionary;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  };

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.testingEvent){
      this.columnDictionary = this.testingEvent['cols'];
      this.displayedColumns = this.parseColKeys(this.testingEvent);
      this.dataSource = new MatTableDataSource<any>(this.testingEvent.rows)
    }
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


  onMarkTestComplete(userEventRegistrationId: string, currentItemLinkId: string) {
    openConfirmationDialog(
      this.dialog,
      {
        title: "Complete Test",
        content: `This will update the status of the test to "Complete". Do you want to proceed?`,
        primaryActionBtnTitle: "Yes",
        secondaryActionBtnTitle: "No",
        width: "25em",
        isPrimaryButtonLeft: true
      })
      .subscribe(
        action => {
          if (action == 'primaryAction') {
            this.testingEventUpdated.emit({userEventRegistrationId: userEventRegistrationId, currentItemLinkId: currentItemLinkId });
          }
        }
      );
  }

  onDownloadFile() {
    console.log("On Download file");
  }
}
