import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { OrderService } from 'src/app/_service/order.service';
import { PlanService } from 'src/app/_service/plan.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent {
  plandata: any;
  searchbox = false;
  isLoggedIn: any = false;
  @Input() isRoleIn: any;
  _isRoleName: any = '0';
  orderNumber:any;
  address:any;
  name:any;
  searchForm!: FormGroup;
  @Input() notificationCountData:any;


  planCount$!: Observable<object[]>;
  clickedItem: string= '';
  searchText: any;
  isShowNotifications: boolean = false;
  notificationListData: any;

  ngOnInit(): void {
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public planService: PlanService,
    public authService: AuthService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private formBuilder: FormBuilder
  ) {

    this.searchForm = formBuilder.group({
      order_number: [''],
      name:[''],
      address: ['']
    });
    this.authService.getDashboard().subscribe((data: any) => {
      this.isLoggedIn = data;
      if(this.isLoggedIn){

      }
    });

    this.authService.getRole().subscribe((data: any) => {
      if (data != false) {
        this.isRoleIn = data[0];
      } else {
        this.isRoleIn = data;
      }
    });

    if (this.isRoleIn == '1') {
      this.planCount();
    }

    this._isRoleName = this.authService._isRoleName;
  }

  planCount() {
    this.planService.planCount();
    this.planCount$ = this.planService.getPlanCount();

    this.planCount$.subscribe((data: any) => {
      this.plandata = data?.result;
    });
  }
  clearNotification(id:any){
    var formdata = new FormData();
    formdata.append('notif_ids', JSON.stringify(id));
    this.planService.clearNotification(formdata).subscribe((res:any)=>{
      this.notificationCountData= 0;
    })
  }
  

  notificationList(isClearNotification:boolean){
    
    this.planService.notificationList().subscribe((res)=>{
      
      this.notificationListData= res.result.results;
     let ids=  this.notificationListData.filter(function(e:any){return e}).map(function(e:any){
        return e.id
        });
        if(isClearNotification){
          this.clearNotification(ids)
        }
    })
  }
  deleteNotification(id:any){
    var formdata = new FormData();
    formdata.append('notif_ids', JSON.stringify([Number(id)]));
    this.planService.deletNotification(formdata).subscribe((res)=>{
      
      this.notificationListData= res.result.results;
     
        this.notificationList(false);
      })
  }
  searchboxopen() {
    this.searchbox = !this.searchbox;
  }

  bookmarkedfield() {
    this.authService.setRouter({
      bookmarked: true,
      plan: null,
      search_text: null,
      deactivated: null,
      start_date: null,
      end_date: null,
    });
  }

  searchfield(event: any) {
    let textVal = event.target.value;
    if (textVal == '') {
      textVal = null;
    }
    this.authService.setRouter({
      search_text: textVal,
      plan: null,
      bookmarked: null,
      deactivated: null,
      start_date: null,
      end_date: null,
    });
  }

  planfield(id: Number) {
    this.authService.setRouter({
      plan: id,
      search_text: null,
      bookmarked: null,
      deactivated: null,
      start_date: null,
      end_date: null,
    });
  }
  onClickTopItem(item:string){
    this.clickedItem = item;
  }

  updateSearch(){
    this.searchbox = !this.searchbox;
    if(this.searchForm.controls['order_number'].value && this.searchForm.controls['order_number'].value.length > 0){
      this.searchText=this.searchForm.controls['order_number'].value;
      this.orderService.updateSearchText(this.searchForm.controls['order_number'].value);
    } else if(this.searchForm.controls['name'].value && this.searchForm.controls['name'].value.length > 0){
      this.searchText=this.searchForm.controls['name'].value;
      this.orderService.updateSearchText(this.searchForm.controls['name'].value);
    }else if(this.searchForm.controls['address'].value && this.searchForm.controls['address'].value.length > 0){
      this.searchText=this.searchForm.controls['address'].value;
      this.orderService.updateSearchText(this.searchForm.controls['address'].value);
    } else{
      this.searchText=undefined;
      this.orderService.updateSearchText('');

    }
  }
  clearSearch(){
    this.searchbox = !this.searchbox;
    this.searchText=undefined;
    this.searchForm.patchValue({
      order_number: '',
      name:'',
      address:''
    })
    this.orderService.updateSearchText('');
  }
  showNotifications(){

    this.isShowNotifications= !this.isShowNotifications
    this.notificationList(true);
  }
}
