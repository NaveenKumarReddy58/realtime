import { Component } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  imageSrc:any= 'assets/images/profilephoto.png';
  _isRoleName: any = '0';

  constructor(private authService: AuthService){

  }

  ngOnInit(){
    this._isRoleName = this.authService._isRoleName;
  }

}
