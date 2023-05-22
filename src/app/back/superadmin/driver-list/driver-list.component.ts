import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { DriverService } from 'src/app/_service/driver.service';
import { PlanService } from 'src/app/_service/plan.service';
import { DialogAnimationsComponent } from '../../common/dialog-animations/dialog-animations.component';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent {
  expandedIndex = 0;
  items: any;

  loading = false;
  delloading = false;
  toggle: any = [];

  driver$!: Observable<object[]>;
  isShowDeleteDriverDialog: boolean= false;
  phoneIndex: any;
  isShowContactDialog: boolean= false;
  selectedDriversCount: any=0;
  isShowPushNotificationForm: boolean= false;
  imageSrc: any= "../../assets/images/photoupload.png";
  activeDriversCount: any= 0;
  tabName: string = "TD";
  copyOfDriversList: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    public driverService: DriverService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.driverList();
  }
  ngOnInit(): void {

  }

  driverList(id?: number) {
    this.driverService.driverList(id);
    this.driver$ = this.driverService.getDrivers();

    this.driver$.subscribe((data: any) => {
      if(data && data.result && data.result.results){
        this.items = data.result.results.sort((a:any, b:any) => {
          if (a.is_active > b.is_active)
            return -1;
          if (a.is_active < b.is_active)
            return 1;
          return 0;
        });
        this.copyOfDriversList= this.items;
        this.items.forEach((obj:any) => obj["checked"] = false)
        this.getCountOfActiveDrivers();
      }
    });
  }

  getCountOfActiveDrivers(){
    this.activeDriversCount = this.copyOfDriversList.reduce((counter:any, obj:any) => obj.is_active === true ? counter += 1 : counter, 0);
  }
  getSelectedDrivers(dList:any){
    this.selectedDriversCount = this.items.reduce((counter:any, obj:any) => obj.checked === true ? counter += 1 : counter, 0); // 6
  }
  changeStatus(id:any , status:any){
    for(var i=0; i < this.items.length; i++){
      if(this.items[i].id == id){
        this.items[i].checked = !status;
      }
    }
    this.getSelectedDrivers(this.items)
  }
  onClickPushNotification(){
    this.isShowPushNotificationForm = !this.isShowPushNotificationForm;
  }
  selectAll(){
    for(var i=0; i < this.items.length; i++){
        this.items[i].checked = true;
    }
    this.getSelectedDrivers(this.items)
  }
  deSelectAll(){
    for(var i=0; i < this.items.length; i++){
      this.items[i].checked = false;
  }
  this.getSelectedDrivers(this.items)
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogAnimationsComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  stopNav(event:any){
    event.stopPropagation();
  }
  driverActivateDeactivate(id: Number, status: any) {
    this.loading = true;
    this.driverService.driverActivateDeactivate(id, status).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.loading = false;
          return;
        }

        this.driverList();
        this.router.navigate(['/admin/driver']);
        this.toastr.success('Warehouse Status Updated');
      },
      (error) => {
        this.authService.dataError(error);
        this.loading = false;
      }
    );
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result
      };

      reader.readAsDataURL(file);
    }
  }
  onClickDeleteDriverDialog(e:any){
    e.preventDefault()
    this.isShowDeleteDriverDialog = !this.isShowDeleteDriverDialog;
  }
  onClickPhone(index:any){
    this.phoneIndex = index;
    this.isShowContactDialog= !this.isShowContactDialog;
  }
  copyText(val: string){
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
      this.isShowContactDialog= !this.isShowContactDialog;

  }
  deleteDriversList(data:any){
    this.isShowDeleteDriverDialog = !this.isShowDeleteDriverDialog;
    let selectedDrivers = this.items.filter((item:any) => item.checked);
    selectedDrivers.forEach((elt:any) => {
      this.driverDelete(elt.id);
    });
  }
  driverDelete(id: any) {
    this.toggle[id] = true;
    this.delloading = true;
    this.driverService.driverDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }

        this.driverList();
        this.router.navigate(['/admin/driver']);
        this.toastr.success('Driver Deleted');
        this.delloading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.delloading = false;
      }
    );
  }
  totalDrivers(){
    this.tabName= "TD";
    this.items = this.copyOfDriversList;
  }
  activeDrivers(){
    this.tabName= "AD";
    this.items = this.copyOfDriversList.filter(function(element:any){
      if(element.is_active){
        return element;
      }
    })

  }
  inActiveDrivers(){
    this.tabName= "INAD";
    this.items = this.copyOfDriversList.filter(function(element:any){
      if(!element.is_active){
        return element;
      }
    })
  }

  search(e:any){
    this.items = this.copyOfDriversList.filter(function(element:any){
      let str = element.first_name+element.last_name;
      if(str.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1){
        return element;
      }
    })
  }
}
