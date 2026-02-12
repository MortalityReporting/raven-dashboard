import {Component, OnInit, ViewChild, Inject, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {DecedentGridDTO} from "../../../../../model/decedent.grid.dto";
import {DecedentService} from "../../../services/decedent.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {BundleHelperService, FhirHelperService} from "../../../../fhir-util";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {MatTableDataSource} from "@angular/material/table";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import {FHIRProfileConstants} from "../../../../../providers/fhir-profile-constants";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {
  FormGroup,
  FormBuilder,
  FormControl
} from "@angular/forms";
import {DeathDateRange} from "../../../models/death-date-range";
import {GridSearchParams} from "../../../models/grid-search-params";



export type Gender = 'male' | 'female' | 'unknown';


@Component({
  selector: 'record-viewer-decedent-records-grid',
  templateUrl: './decedent-records-grid.component.html',
  styleUrls: ['../../../record-viewer-styles.scss', '../search-records.component.scss'],
  standalone: false
})
export class DecedentRecordsGridComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['lastName', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;
  datePipe: DatePipe;

  pageSize = 10;
  currentPage = 0;

  readonly genderOptions = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
    {value: 'unknown', label: 'Unknown'}
  ] as const;

// Or simpler array if you want same value/label
  readonly genders: Gender[] = ['male', 'female', 'unknown'];

  @Output() serverErrorEventEmitter = new EventEmitter();
  totalDataSize: number = 0;
  readonly pageSizes = [5, 10, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly searchFilterForm = new FormGroup({
    name: new FormControl<string>(''),
    gender: new FormControl<Gender | null>(null),
    deathDate: this.fb.group({
      start: [null],
      end: [null]
    })
  });

  constructor(
    private fb: FormBuilder,
    private decedentService: DecedentService,
    private router: Router,
    private fhirHelperService: FhirHelperService,
    private bundleHelperService: BundleHelperService,
    @Inject('config') public config: ModuleHeaderConfig,
    @Inject('appConfig') public appConfig: AppConfiguration,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) {
  }

  private get searchParams(): GridSearchParams {
    const params: GridSearchParams = {};

    // Add gender if selected
    const gender = this.searchFilterForm.controls.gender.value;
    if (gender) {
      params.gender = gender;
    }

    // Add death date range
    const deathDate = this.deathDateRange;
    if (deathDate) {
      params.deathDate = deathDate;
    }

    // Add death date range
    const name = this.searchFilterForm.controls.name.value;
    if (name) {
      params.name = name;
    }

    return params;
  }

  private get deathDateRange(): DeathDateRange | null {
    const startValue = this.searchFilterForm.controls.deathDate.controls.start.value;
    const endValue = this.searchFilterForm.controls.deathDate.controls.end.value;

    if (!startValue && !endValue) {
      return null;
    }

    return {
      ...(startValue && {start: this.datePipe.transform(startValue, 'yyyy-MM-dd')!}),
      ...(endValue && {end: this.datePipe.transform(endValue, 'yyyy-MM-dd')!})
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

    this.decedentService.getDecedentRecordsAsGridDTOs(pageNumber, pageSize, searchParams)
      .subscribe({
        next: (result) => {
          this.totalDataSize = result.totalCount;
          this.decedentGridDtoList = result.dtos;


          this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
          this.setDataSourceFilters();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading decedent records:', error);
          this.serverErrorEventEmitter.emit();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnInit(): void {
    this.decedentService.setSearchResultsBundleId(null);
    this.getDecedentRecords(this.currentPage, this.pageSize);
  }

  onCaseSelected(row: any) {
    this.router.navigate([`${this.appConfig.modules['recordViewer'].route}/mdi/`, row.decedentId]);
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

  getDecedentFullName(decedent: DecedentGridDTO): string {
    if (decedent.lastName === 'MASKED' || decedent.firstName === 'MASKED') {
      return 'MASKED';
    }

    if (!decedent.lastName && !decedent.firstName) {
      return '';
    }

    if (!decedent.firstName) {
      return decedent.lastName || '';
    }

    return `${decedent.lastName}, ${decedent.firstName}`;
  }

}
