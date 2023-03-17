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
        animate(4000, style({ opacity: 1 })),
        style({ opacity: 1 }),
      ]),
      transition(':leave', [
        style({ opacity: 0 }),
        animate(4000, style({ opacity: 0 })),
        style({ opacity: 0 }),
      ]),
    ]),
  ],
})
export class SplashComponent {
  fadeToggle = true;
}
