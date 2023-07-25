import {Component, Input} from '@angular/core';
import {Test} from "../../model/test";
import {CURRENT_TESTS, WorkflowService} from "../../service/workflow.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-standalone-tests',
  templateUrl: './standalone-tests.component.html',
  styleUrls: ['./standalone-tests.component.css']
})
export class StandaloneTestsComponent {
  testList: Test[];
  constructor(private workflowService: WorkflowService, private router: Router){}
  ngOnInit(): void {
    this.workflowService.setTestList(CURRENT_TESTS);
    this.workflowService.testList$.subscribe({
      next: value => this.testList = value,
      error: err => console.error(err)
    })
  }

  onStartTest(test: Test) {
    this.router.navigate([`/workflow-simulator/${test.name}`]);
  }
}
