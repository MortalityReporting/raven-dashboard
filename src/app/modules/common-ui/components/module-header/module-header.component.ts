import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModuleHeaderService} from "../../../../service/module-header.service";

@Component({
  selector: 'app-module-header',
  templateUrl: './module-header.component.html',
  styleUrls: ['./module-header.component.css']
})
export class ModuleHeaderComponent implements OnInit {

  @Input() moduleDetails: any;
  showHeader: boolean = false;
  moduleTitle = undefined;
  componentTitle = undefined;
  backgroundColor = undefined;
  icon = undefined;

  constructor(private router: Router,
              private moduleHeaderService: ModuleHeaderService
  ) { }

  ngOnInit(): void {
    this.moduleHeaderService.moduleHeaderConfig$.subscribe(value => {
      this.showHeader = value.showHeader;
      this.moduleTitle = value.moduleTitle;
      this.backgroundColor = value.backgroundColor;
      this.componentTitle = value.componentTitle;
      this.icon = value.icon;
    });
  }

}
