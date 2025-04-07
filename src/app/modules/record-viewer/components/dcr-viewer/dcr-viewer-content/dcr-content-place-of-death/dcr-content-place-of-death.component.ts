import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-content-place-of-death',
  standalone: false,
  templateUrl: './dcr-content-place-of-death.component.html',
  styleUrl: './dcr-content-place-of-death.component.css'
})
export class DcrContentPlaceOfDeathComponent {
  @Input() placeOfDeath!: any;
}
