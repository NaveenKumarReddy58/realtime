import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  myimg = 'assets/images/bannerslider.png'

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
  slickInit(e: any) {
    // console.log('slick initialized');
  }
  breakpoint(e: any) {
    // console.log('breakpoint');
  }
  afterChange(e: any) {
    // console.log('afterChange');
  }
  beforeChange(e: any) {
    // console.log('beforeChange');
  }
  constructor() { }
  ngOnInit(): void { }
}
