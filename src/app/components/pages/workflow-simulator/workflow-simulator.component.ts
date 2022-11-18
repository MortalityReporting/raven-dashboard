import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.css']
})
export class WorkflowSimulatorComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
    console.log(this.router)
  }

  onStartWorkflow() {
    this.router.navigate(['/workflow-simulator/search-edrs']);
  }
}
