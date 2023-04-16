import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError, BehaviorSubject, Observable } from 'rxjs';

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

  private _order = new BehaviorSubject<object[]>([]);
  private orderData: { order: object[] } = { order: [] };

  getOrder(): Observable<any[]> {
    return this._order.asObservable();
  }

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

  orderEdit(id: Number, form: any) {
    return this.http
      .put<any>(`${this._liveApiUrl}/company/order/${id}/`, form)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  //page:1
  //order_date:2023-04-14
  //order_type:pickup
  //order_status:successful

  orderList(id?: number, filter?: any) {
    let tail = '';
    if (id != 0) {
      tail += id;
    }
    let params = new URLSearchParams();
    if (params) {
      for (let key in filter) {
        params.set(key, filter[key]);
      }
    }
    if (filter) {
      tail += `?` + params.toString();
    }
    this.http
      .get<any>(`${this._liveApiUrl}/company/order-listing/${tail}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          if (this.authService.resultCodeError(data)) {
            return;
          }

          this.orderData.order = data;
          this._order.next(Object.assign({}, this.orderData).order);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  orderDelete(id: Number) {
    return this.http.delete<any>(`${this._liveApiUrl}/company/order/${id}`);
  }
}
