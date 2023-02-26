import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  group,
} from '@angular/animations';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 1 }),
        animate(5000, style({ opacity: 0 })),
        style({ opacity: 0 }),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(5000, style({ opacity: 0 })),
        style({ opacity: 0 }),
      ]),
    ]),
  ],
})
export class SplashComponent {
  fadeToggle = true;
}
