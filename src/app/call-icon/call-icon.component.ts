import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-call-icon',
  templateUrl: './call-icon.component.html',
  styleUrls: ['./call-icon.component.css']
})
export class CallIconComponent {

    @Input() cIndex: any;
  isShowCaller: boolean= false;
  phoneIndex: any;
  onClickPhone(i:any){
    this.phoneIndex= this.cIndex;
    this.isShowCaller= !this.isShowCaller
  }
  copyText(val:any){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.isShowCaller= !this.isShowCaller
  }
}
