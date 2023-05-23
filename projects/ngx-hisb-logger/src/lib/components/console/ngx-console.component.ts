import {Component, Input} from '@angular/core';
import {LogLine} from "../../modal/log-line";

@Component({
  selector: 'lib-console',
  templateUrl: './ngx-console.component.html',
  styleUrls: ['./ngx-console.component.css']
})
export class NgxConsoleComponent {
  @Input() logs: LogLine[] = []
}
