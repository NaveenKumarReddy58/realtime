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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [animate(1, style({ opacity: 1 }))]),
      transition(':leave', [
        animate(2000, style({ opacity: 0, transform: 'translateX(-250px)' })),
      ]),
    ]),
  ],
})
export class SplashComponent {
  toggleFlag = true;

  constructor() {}

  ngOnInit(): void {}
}
