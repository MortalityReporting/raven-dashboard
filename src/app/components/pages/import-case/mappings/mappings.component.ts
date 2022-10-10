import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css']
})
export class MappingsComponent implements OnInit, OnChanges {

  @Input() fhirBundle: any;
  displayedColumns: string[] = ['name', 'value', 'status'];
  dataSource = new MatTableDataSource<any>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['fhirBundle'].currentValue){
      const value = changes['fhirBundle'].currentValue;
      const mapped = Object.keys(value.fields).map(key => {return {
        name: key,
        status: value.fields[key].status,
        value: value.fields[key].value,
        FHIRResource: value.fields[key].FHIRResource,
      }});
      this.dataSource.data = mapped;
    }
  }

}
