import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {DecedentGridDTO} from "../../../../../../model/decedent.grid.dto";
import {MatSort} from "@angular/material/sort";
import {DecedentService} from "../../../../../record-viewer/services/decedent.service";
import {UtilsService} from "../../../../../../service/utils.service";
import {switchMap} from "rxjs";
import {SearchEdrsService} from "../../../../services/search-edrs.service";
import {DecedentSimpleInfo} from "../../../../../../model/decedent-simple-info";
import {DatePipe} from "@angular/common";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ModuleHeaderConfig} from "../../../../../../providers/module-header-config";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AppConstants} from "../../../../../../providers/app-constants";
import {GridSearchParams} from "../../../../../record-viewer/models/grid-search-params";


export interface DeathDateRange{
  start?: string;
  end?: string;
}

export type Gender = 'male' | 'female' | 'unknown';

@Component({
    selector: 'app-mdi-to-edrs-grid',
    templateUrl: './mdi-to-edrs-grid.component.html',
    styleUrls: ['./mdi-to-edrs-grid.component.scss'],
    standalone: false
})
// For now this class component is almost exactly the same as the one we use for the decedent-records-grid.
// However, the functionality will be different and we are going to change the code at some point in the near future.
export class MdiToEdrsGridComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['lastName', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;
  datePipe: DatePipe;
  selectedCase: any;
  decedentInfo: DecedentSimpleInfo;
  selectedRecord : DecedentGridDTO = null;

  pageSize = 5;
  currentPage = 0;
  mannerOfDeathList: {code: number, display: string}[] = [];

  readonly genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Unknown' }
  ] as const;

  @Output() serverErrorEventEmitter = new EventEmitter();
  totalDataSize: number = 0;
  readonly pageSizes = [5, 10, 20];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly searchFilterForm = new FormGroup({
    name: new FormControl<string>(''),
    gender: new FormControl<Gender | null>(null),
    deathDate: this.fb.group({
      start: [null],
      end: [null]
    }),
    mannerOfDeath: new FormControl<string>(''),
    // nameStatus: new FormControl(this.nameStatusList[0].value),
  });

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    private fb: FormBuilder,
    private decedentService: DecedentService,
    private utilsService: UtilsService,
    private searchEdrsService: SearchEdrsService,
    private appConstants: AppConstants,
    private cdr: ChangeDetectorRef
  ) {
    this.mannerOfDeathList = this.appConstants.MANNER_OF_DEATH_LIST;
  }

  private get searchParams(): GridSearchParams {
    const params: GridSearchParams = {};

    const gender = this.searchFilterForm.controls.gender.value;
    if (gender) {
      params.gender = gender;
    }

    const deathDate = this.deathDateRange;
    if (deathDate) {
      params.deathDate = deathDate;
    }

    const name = this.searchFilterForm.controls.name.value;
    if (name) {
      params.name = name;
    }

    const mannerOfDeath = this.searchFilterForm.controls.mannerOfDeath.value;
    if (mannerOfDeath) {
      params.mannerOfDeath = mannerOfDeath;
    }

    // const nameStatus = this.searchFilterForm.controls.nameStatus.value;
    params.nameStatus = 'hasName';

    return params;
  }


  private get deathDateRange(): DeathDateRange | null {
    const startValue = this.searchFilterForm.controls.deathDate.controls.start.value;
    const endValue = this.searchFilterForm.controls.deathDate.controls.end.value;

    if (!startValue && !endValue) {
      return null;
    }

    return {
      ...(startValue && { start: this.datePipe.transform(startValue, 'yyyy-MM-dd')! }),
      ...(endValue && { end: this.datePipe.transform(endValue, 'yyyy-MM-dd')! })
    };
  }

  onSearch() {
    let searchParams: GridSearchParams = this.searchParams;
    if (searchParams) {
      this.decedentService.setSearchResultsBundleId(null);
    }
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;
    this.getDecedentRecords(this.currentPage, this.pageSize, searchParams)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getDecedentRecords(pageNumber: number, pageSize: number, searchParams?: GridSearchParams) {
    this.isLoading = true;
    this.selectedRecord = null;

    this.decedentService.getDecedentRecordsAsGridDTOs(pageNumber, pageSize, searchParams)
      .subscribe({
        next: (result) => {
          this.totalDataSize = result.totalCount;
          this.decedentGridDtoList = result.dtos;

          this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
          this.setDataSourceFilters();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Error loading decedent records:', error);
          this.serverErrorEventEmitter.emit();
        }
      });
  }

  ngOnInit(): void {
    this.decedentService.setSearchResultsBundleId(null);
    this.getDecedentRecords(this.currentPage, this.pageSize,  {nameStatus: 'hasName'});
  }

  onCaseSelected(decedent: any) {
    this.selectedRecord = decedent;
    this.selectedCase = decedent;
    this.decedentInfo = new DecedentSimpleInfo();
    this.decedentInfo.mdiTrackingNumber = decedent.caseNumber;
    this.decedentInfo.dateTimeOfDeath = decedent.tod;
    this.decedentInfo.name = decedent.lastName + ', ' + decedent.firstName ? ', ' + decedent.firstName : '';
    this.decedentInfo.patientResource = decedent.patientResource;
    this.searchEdrsService.setDecedentData(this.decedentInfo);

    this.decedentService.getComposition(decedent.decedentId).pipe(
      switchMap(
        composition => this.decedentService.getDocumentBundle(composition?.entry?.[0]?.resource?.id)
      )
    ).subscribe({
      next: result => this.searchEdrsService.setDocumentBundle(result),
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Error retrieving document bundle.")
      }
    });
  }

  private setDataSourceFilters() {
    this.datePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formatted = this.datePipe.transform(data.tod, 'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data, filter);
    }
  }

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    let searchParams: GridSearchParams = this.searchParams;
    this.getDecedentRecords(this.currentPage, this.pageSize, searchParams);
  }
}
