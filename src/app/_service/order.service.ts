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

  private _orderCount = new BehaviorSubject<object[]>([]);
  private orderCountData: { orderCount: object[] } = { orderCount: [] };

  getOrder(): Observable<any[]> {
    return this._order.asObservable();
  }

  getOrderCount(): Observable<any[]> {
    return this._orderCount.asObservable();
  }
  // order_no:4444

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

  orderList(order_date?: any, order_type?:any, order_status?:any) {
    let tail = '';
    let params = new URLSearchParams();
    if (params) {
      if(order_date && order_date.length > 0){
        params.set('order_date', order_date)
      }
      if(order_type && order_type.length > 0 && order_type != 'both'){
        params.set('order_type', order_type)
      }
      if(order_status && order_status.length > 0 && order_status != 'all'){
        params.set('order_status', order_status)
      }
    }
    if(order_date || order_type || order_status){
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

  orderDetail(id: number) {
    return this.http
      .get<any>(`${this._liveApiUrl}/company/order-details/${id}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  orderDelete(id: Number) {
    return this.http.delete<any>(`${this._liveApiUrl}/company/order/${id}`);
  }

  orderAssign(form: any) {
    return this.http
      .post<any>(`${this._liveApiUrl}/company/assign-order/`, form)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  orderCount(order_date?: any, order_type?:any) {
    let tail = '';
    let params = new URLSearchParams();
    if (params) {
      if(order_date && order_date.length > 0){
        params.set('order_date', order_date)
      }
      if(order_type && order_type.length > 0 && order_type != 'both'){
        params.set('order_type', order_type)
      }
    }
    if(order_date || order_type){
      tail += `?` + params.toString();
    }
    this.http
      .get<any>(`${this._liveApiUrl}/company/order-counts/${tail}`)
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

          this.orderCountData.orderCount = data;
          this._orderCount.next(
            Object.assign({}, this.orderCountData).orderCount
          );
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }
}
