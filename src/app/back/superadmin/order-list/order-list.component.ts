import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_service/auth.service';
import { OrderService } from 'src/app/_service/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  orderData: any;
  loading = false;
  delloading = false;
  toggle: any = [];

  id: any;
  optionstype: any = 'all';

  buttonData: any = ['Unassigned', 'Pending', 'Cancelled', 'Successful'];

  order$!: Observable<object[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public orderService: OrderService,
    private toastr: ToastrService
  ) {
    this.orderList(0);

    // this.route.queryParams.subscribe((params) => {
    //   if (params['plan'] != undefined) {
    //     this.id = params['plan'];
    //   } else {
    //     this.id = 0;
    //   }

    //   if (
    //     params['plan'] != undefined ||
    //     params['bookmarked'] != undefined ||
    //     params['search_text'] != undefined
    //   ) {
    //     this.optionstype = 'all';
    //   }

    //   if (Object.keys(params).length === 0 && params.constructor === Object) {
    //     this.orderList(0);
    //   } else {
    //     this.orderList(this.id, params);
    //   }
    // });
  }

  ngOnInit(): void {}

  orderList(id?: number, filter?: any) {
    this.orderService.orderList(id, filter);
    this.order$ = this.orderService.getOrder();

    this.order$.subscribe((data: any) => {
      this.orderData = data?.result?.results;
    });
  }

  orderDelete(id: any) {
    this.toggle[id] = true;
    this.delloading = true;
    this.orderService.orderDelete(id).subscribe(
      (data: any) => {
        if (this.authService.resultCodeError(data)) {
          this.delloading = false;
          return;
        }

        this.orderList();
        this.router.navigate(['/admin/order']);
        this.toastr.success('Order Deleted');
        this.delloading = false;
      },
      (error) => {
        this.authService.dataError(error);
        this.delloading = false;
      }
    );
  }
}
