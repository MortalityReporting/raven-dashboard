import {Component, OnInit} from '@angular/core';
import {UserProfileManagerService} from "../../services/user-profile-manager.service";
import {AuthService} from '@auth0/auth0-angular';
import {environment as env} from "../../../../../environments/environment";
import {DashboardApiInterfaceService} from "../../../dashboard-api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {mergeMap, ReplaySubject, share, switchMap} from "rxjs";
import {EventManagerService, TestStatusCodes} from "../../../testing-events";
import {UtilsService} from "../../../../service/utils.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  currentUser: any;
  env = env;
  testEvents: any = undefined;
  error: any = undefined;
  selectedEvent: any;
  selected: any;
  refreshTrigger$ = new ReplaySubject(1);
  isLoading = false;

  constructor(
      private userProfileManager: UserProfileManagerService,
      public auth: AuthService,
      private dashboardApiInterface: DashboardApiInterfaceService,
      protected eventManager: EventManagerService,
      private utilsService: UtilsService) {

    this.userProfileManager.currentUser$.subscribe({next: value => {this.currentUser = value;}});
    this.userProfileManager.getAllUsers().subscribe();
  }
  ngOnInit(): void {
    let adminPanelData$ = this.refreshTrigger$.pipe(
      switchMap(() => this.dashboardApiInterface.getAdminPanelData()),
      share()
    );

    // Initial call to "refresh".
    this.refreshTrigger$.next(1);

    adminPanelData$.subscribe({
      next: value => {
        this.error = undefined;
        this.testEvents = value['events'];
        this.selectedEvent = this.testEvents[0];
      },
      error: (e) => {
        this.testEvents = undefined;
        console.error(e)
        this.error = e;
      }
    })
  }

  onSelectionChanged(testEvent: any) {
    this.selectedEvent = testEvent;
  }

  updateStatusToComplete(userEventRegistrationId: string, currentItemLinkId: string) {
    this.isLoading = true;
    let updateStatus$ = this.eventManager.getUserEventRegistrationById(userEventRegistrationId).pipe(
      mergeMap(response => {
        console.log(response)
        return this.eventManager.updateTestStatus(response, currentItemLinkId, TestStatusCodes.complete)
      })
    );
    updateStatus$.subscribe({
      next: value => {
        this.refreshTrigger$.next(1);
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Server error updating the test status");
        this.isLoading = false;
      }
    })
  }

  exportToPdf(event){
    const pdfBlob = this.generateAutoTablePDF(event);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(pdfBlob);
    downloadLink.download = `${event.title}.pdf`;

    // Trigger the download
    downloadLink.click();
    downloadLink.remove()
  }

  private generateAutoTablePDF(testEvent){
    let pdf = new jsPDF("landscape");
    const reportTitle = testEvent.title;
    pdf.setFontSize(6);
    pdf.setTextColor(119, 119, 119);
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(reportTitle, 14, 12);
    autoTable(pdf, {
      body: testEvent.rows.map(this.addKeySuffix),
      columns: this.getAutoTableColumns(testEvent)
    });
    return new Blob([pdf.output('blob')]);
  }

  /**
   * Flatten the event data and append "str" to the numeric keys (tests in this case)
   * @param testEvent
   * @private
   */
  private getAutoTableColumns(testEvent) {
    return [
      {"header": "User", "dataKey": "name"},
      {"header": "Email", "dataKey": "email"},
      ...Object.entries(testEvent.cols).map(([key, header]) => ({
        header,
        dataKey: `${key}str` //jspdf autotable does not recognize numeric keys, so we add suffix "str" by hand
      })),
    ];
  }

  /**
   * jspdf autoTable does not recognize numeric keys, so we add suffix "str" by hand
   * @param obj
   * @private
   */
  private addKeySuffix(obj) { //
    const newObj = {};
    for (const key in obj) {
      if (key !== "name" && key !== "email") {
        newObj[`${key}str`] = obj[key];
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  onTestingEventUpdated(event: any) {
    this.updateStatusToComplete(event.userEventRegistrationId, event.currentItemLinkId);
  }
}
