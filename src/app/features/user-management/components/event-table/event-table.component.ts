import {Component, EventEmitter, Output, ViewChild, ChangeDetectionStrategy, input, effect} from '@angular/core';
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {EventManagerService, TestStatusDictionary} from "../../../testing-events"
import {MatDialog} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {openConfirmationDialog} from "../../../../components/widgets/confirmation-dialog/conformation-dialog.component";

@Component({
    selector: 'app-event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatTableModule,
        MatSortModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule
    ]
})
export class EventTableComponent {
  testingEvent = input.required<any>();
  @Output() testingEventUpdated =
    new EventEmitter<{userEventRegistrationId: string, currentItemLinkId: string}>()

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  columnDictionary: {};

  TestStatusDictionary = TestStatusDictionary;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  };

  constructor(private dialog: MatDialog, private eventManagementService: EventManagerService) {
    effect(() => {
      const event = this.testingEvent();
      if(event){
        this.columnDictionary = event['cols'];
        this.displayedColumns = this.parseColKeys(event);
        this.dataSource = new MatTableDataSource<any>(event.rows)
      }
    });
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

  onDownloadFile(currentItemLinkId: string, element) {
    console.log(element.attachments[currentItemLinkId])
    const filepath = element?.attachments[currentItemLinkId]
    this.eventManagementService.getAttachment(filepath).subscribe(
      {
        next: value => {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([value]));
          link.download = filepath;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    );
  }
}
