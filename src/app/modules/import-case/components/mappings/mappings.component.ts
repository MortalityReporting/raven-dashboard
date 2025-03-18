import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FileTemplateService} from "../../services/file-template.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-mappings',
    templateUrl: './mappings.component.html',
    styleUrls: ['./mappings.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class MappingsComponent implements OnChanges {
  @Input() fhirBundle;

  selectedFilter: string = 'All';
  filters: string[] = ['All', 'Mapped', 'Not Mapped'];
  innerTableDisplayedColumns: string[] = ['name','status', 'value'];
  parsedResponse: any;
  dataSource: MatTableDataSource<any>;
  columnsToDisplay  = ['name', 'status', 'value'];
  expandedRow: any | null;
  selectedRow: any;
  statusFilter: string | null = null;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.fhirBundle){
      this.setDataSource(this.fhirBundle, this.statusFilter);
      this.selectedFilter = this.filters?.[0];
    }
  }

  setDataSource(value, statusFilter) {
    this.parsedResponse = Object.keys(value?.fields).map(key => {
      return {
        name: key,
        valueObject: value.fields[key],
      }
    })
      .map(element => {
        if (element?.valueObject?.length || element?.valueObject?.length === 0) {
          const inner = element?.valueObject
            .map(inner => {
              return Object.keys(inner).map(key => {
                return {
                  name: key,
                  valueObject: inner[key],
                }
              });
            });
          element.valueObject = inner;
          return element;
        } else {
          return element;
        }
      })
      .map(element => {
        if (element.valueObject?.length) {
          const mapped = element.valueObject.map((inner, index) => {
            const result = {
              name: element.name + " " + (index + 1),
              valueObject: inner
            }
            return result
          });
          return mapped;
        } else {
          return element;
        }
      })
      .flat().sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
      .filter(element => {
        if (!statusFilter || !element.valueObject.status) {
          return true;
        } else {
          return element.valueObject.status === statusFilter;
        }
      });

    this.parsedResponse.forEach(element => {
      if (element.valueObject.length && statusFilter) {
        element.valueObject = element.valueObject.filter(inner => inner.valueObject.status === statusFilter);
      }
    })

    this.dataSource = this.parsedResponse;
  }


  onRowClick(row: any) {
    this.selectedRow = row;
  }

  onFilterChanged(selectedFilter: string) {
    let filter = ''
    if(selectedFilter === 'Mapped'){
      filter = 'mapped'
    }
    else if(selectedFilter === 'Not Mapped'){
      filter = 'not mapped';
    }
    else {
      filter = null;
    }
    this.setDataSource(this.fhirBundle, filter)
  }


}
