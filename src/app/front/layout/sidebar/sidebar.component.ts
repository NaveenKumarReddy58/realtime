import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, SlickCarouselModule],
})
export class SidebarComponent {
  myimg = 'assets/images/bannerslider.png';

  slides = [
    { img: this.myimg },
    { img: this.myimg },
    { img: this.myimg },
    { img: this.myimg },
    { img: this.myimg },
  ];
  slideConfig = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  addSlide() {
    this.slides.push({ img: this.myimg });
  }
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }
  slickInit(e: any) {}
  breakpoint(e: any) {}
  afterChange(e: any) {}
  beforeChange(e: any) {}
  constructor() {}
  ngOnInit(): void {}
}
