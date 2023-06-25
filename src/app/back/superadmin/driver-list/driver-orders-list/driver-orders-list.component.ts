import { Component, Input } from '@angular/core';
import { DriverService } from 'src/app/_service/driver.service';

@Component({
  selector: 'app-driver-orders-list',
  templateUrl: './driver-orders-list.component.html',
  styleUrls: ['./driver-orders-list.component.css']
})
export class DriverOrdersListComponent {
  driver$: any;
  dataList: any=[];
  driverId: any='';
  @Input() dataDriverId: any;
  @Input() modelData: any;

  @Input() assignedOrdersCount: any;
  orderData: any;
  copyDriverId: any;


  constructor(private driverService: DriverService){

  }

  ngOnInit(){
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

    this.getDriverOrders(this.dataDriverId);
  }

  ngDoCheck(){
    if(this.copyDriverId != this.driverId){
      this.copyDriverId = this.driverId;
      this.getDriverOrders(this.driverId);
    }
  }
  

  getDriverOrders(id:any){
    this.driverService.driverOrders(id).subscribe((res:any)=>{
      if(res && res.result){
        if(this.modelData.status){
          this.orderData = res.result.filter((obj:any) => {
            return obj.order_status == this.modelData.status
          })
        } else{
          this.orderData= res.result;
        }
      } else{
        this.orderData=[];
        this.assignedOrdersCount=0;
      }
    });
  }
}
