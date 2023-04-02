import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  _liveApiUrl: any = this.authService._liveApiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  // po:123545
  // pickup_company_name:Godown
  // pickup_address:2
  // is_pickup_warehouse:true
  // pickup_date:2023-03-30
  // pickup_time:10:00
  // pickup_contact_name:jitendra
  // pickup_email:jit@gmail.com
  // pickup_phone:+919646646757
  // pickup_alt_phone:+919646646757
  // pickup_note:testing pickup
  // dely_company_name:Customer B
  // dely_address:3
  // is_dely_warehouse:false
  // dely_date:2023-03-30
  // dely_time:12:00
  // dely_contact_name:Sandeep
  // dely_email:sandeep@gmail.com
  // dely_phone:+918558048926
  // dely_alt_phone:+918558048926
  // dely_note:test
  // // order_no:4444

  orderAdd(form: any) {
    return this.http.post<any>(`${this._liveApiUrl}/company/order/`, form).pipe(
      map((data: any) => {
        return data;
      }),
      catchError(this.authService.handleError)
    );
  }

  orderList() {
    return this.http.get<any>(`${this._liveApiUrl}/company/order-listing/`);
  }

  orderDelete(id: Number) {
    return this.http.delete<any>(`${this._liveApiUrl}/company/order/${id}`);
  }
}
