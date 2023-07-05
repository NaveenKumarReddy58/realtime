import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DriverService } from 'src/app/_service/driver.service';

@Component({
  selector: 'app-driver-orders-list',
  templateUrl: './driver-orders-list.component.html',
  styleUrls: ['./driver-orders-list.component.css']
})
export class DriverOrdersListComponent {
  driver$: any;
  dataList: any=[];
  driverId: any;
  @Input() dataDriverId: any;
  @Input() modelData: any;

  @Input() assignedOrdersCount: any;
  @Input() pageName: any;
  orderData: any;
  copyDriverId: any;
 @Output() onChangeDriver = new EventEmitter<any>();

  constructor(private driverService: DriverService){

  }

  ngOnInit(){
    if(this.pageName == 'order-details'){
      this.getDriverList();
      this.getDriverOrders(this.dataDriverId);
    }else if(this.pageName == 'driver-details'){
      this.getDriverOrdersList();
    }
  }

  ngDoCheck(){
    if(this.pageName == 'order-details'){
      if(this.copyDriverId != this.driverId){
        this.copyDriverId = this.driverId;
        this.getDriverOrders(this.driverId);
      }
    }
  }

  getDriverOrdersList(){
    let formatDate;
    let status;
    let id = this.modelData.id;
    if(this.modelData.status == 'today'){
      let date = new Date();
      formatDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    } else {
      status = this.modelData.status;
    }
    this.driverService.orderList(id, status, formatDate).subscribe((res:any)=>{
      if(res && res.result){
          this.orderData= res?.result?.results;
      }
    });
  }
  
  getDriverList(){
    this.driverService.driverList();
    this.driver$ = this.driverService.getDrivers();

    this.driver$.subscribe((data: any) => {
      if (data && data.result && data.result.results) {
        this.dataList=[];
        data.result.results.forEach((data: any) => {
          this.dataList.push({
            value: data?.id,
            label: data?.first_name + ' ' + data?.last_name,
          });
        });
        this.driverId = this.dataDriverId;
        this.copyDriverId= this.driverId;
      }
    });

  }

  getDriverOrders(id:any){
    this.onChangeDriver.emit(id);
    this.driverService.orderList(id).subscribe((res:any)=>{
      if(res && res.result){
        if(this.modelData.status){
          this.orderData = res.result.filter((obj:any) => {
            return obj.order_status == this.modelData.status
          })
        } else{
          this.orderData= res?.result?.results;
        }
      } else{
        this.orderData=[];
        this.assignedOrdersCount=0;
      }

    });
  }
}
