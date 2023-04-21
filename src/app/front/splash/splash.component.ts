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
      transition(':enter', [
        style({transform: 'translateX(0%)'}),
        animate('1500ms ease-in', style({transform: 'translateX(100%)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0%)'}),
        animate('1500ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
  ],
})
export class SplashComponent {
  toggleFlag = true;

  constructor() {}

  ngOnInit(): void {}
}
