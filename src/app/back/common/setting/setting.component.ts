import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent {
  constructor(private toastr: ToastrService) {}
  ngOnInit(): void {}

  udpateSettings(){
    this.toastr.success("New Settings Updated");
  }
}
