import {Component, Inject, OnInit} from '@angular/core';
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {ModuleHeaderConfig} from "../../../../../model/model-header-config";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {Clipboard} from '@angular/cdk/clipboard';
import {AuthService} from "@auth0/auth0-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-establish-connection',
  templateUrl: './establish-connection.component.html',
  styleUrl: './establish-connection.component.css'
})
export class EstablishConnectionComponent implements OnInit {

  uiConstantsStep2: any;

  constructor(
    @Inject('workflowSimulatorConfig') public moduleConfig: ModuleHeaderConfig,
    private searchEdrsService: SearchEdrsService,
    private clipboard: Clipboard,
    uiStringConstants: UiStringConstants,
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.uiConstantsStep2 = uiStringConstants.WorkflowSimulator.searchEdrs.step2;
  }

  decedentInfo: DecedentSimpleInfo;
  bearerToken: string = '';
  private authUrl = 'https://dev-dk7cyfpkwowbtdbt.us.auth0.com/oauth/token';

  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });
  }

  protected readonly JSON = JSON;

  onCopyToClipboard(value: string) {
    this.clipboard.copy(value.trim())
  }

  getToken(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      client_id: 'vsRE3dEgCWF24mEf1KOsWD88igoHKAKl',
      client_secret: 'UZVZxFR_Ykj2ByXqqsahso0PO1wDk0Wutl2lCvzf-21Y_I2OugTxUa1hnpwb27Ym',
      audience: 'http://bluejay-fhir-api/',
      grant_type: 'client_credentials',
    };

    return this.http.post(this.authUrl, body, { headers });
  }

  onRequestAuth0Token(){
    this.getToken().subscribe({
      next: value => {console.log(value)},
      error: err => {console.log(err)},
    })
  }
}
