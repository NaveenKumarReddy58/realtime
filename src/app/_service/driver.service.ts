import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError, BehaviorSubject, Observable, switchMap, concatMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  _liveApiUrl: any = this.authService._liveApiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  private _drivers = new BehaviorSubject<object[]>([]);
  private driversData: { drivers: object[] } = { drivers: [] };

  getDrivers(): Observable<any[]> {
    return this._drivers.asObservable();
  }

  driverAdd(form: any) {
    return this.http
      .post<any>(`${this._liveApiUrl}/account/add-driver/`, form)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  driverEdit(id: Number, form: any) {
    return this.http
      .post<any>(`${this._liveApiUrl}/account/edit-driver/${id}`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  driverActivateDeactivate(id: Number, status: any) {
    return this.http
      .put<any>(`${this._liveApiUrl}/account/activatedeactivate-driver/${id}`, status)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  driverDelete(id: Number) {
    return this.http.delete<any>(
      `${this._liveApiUrl}/account/delete-driver/${id}`
    );
  }

  convertBlobToBase64(blob: Blob) {
    return Observable.create((observer:any) => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        console.log("File could not be read: " + event.target.error.code);
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }
  driverDetails(id:any){
    return this.http.get<any>(
      `${this._liveApiUrl}/account/driver-details/${id}`
    );
  }

  driverList(id?: Number) {
    let tail = '';
    if (id) {
      tail = `${id}`;
    }

    this.http
      .get<any>(`${this._liveApiUrl}/account/driver-listing/${tail}`)
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

          this.driversData.drivers = data;
          this._drivers.next(Object.assign({}, this.driversData).drivers);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  driverOrders(id:any){
    let tail = '';
    if (id) {
      tail = `${id}`;
    }
    return this.http.get<any>(`${this._liveApiUrl}/company/driver-orders/${tail}`)
  }

  orderCount(driverId?:any) {
    let tail = '';
    let params = new URLSearchParams();
    if (params) {
      if(driverId && driverId.length > 0){
        params.set('driver_id', driverId)
      }
    }
    if(driverId){
      tail += `?` + params.toString();
    }
    return this.http
      .get<any>(`${this._liveApiUrl}/company/order-counts/${tail}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
  }

  orderList(driver_id?:any, order_status?:any,order_date?: any, page?:any) {
    let tail = '';
    let params = new URLSearchParams();
    if (params) {
      if(order_date && order_date.length > 0){
        params.set('order_date', order_date)
      }
      if(order_status && order_status.length > 0){
        params.set('order_status', order_status)
      }
      if(driver_id){
        params.set('driver_id', driver_id)
      }
      if(page){
        params.set('page', page+1)
      }
    }
    if(order_date ||order_status || driver_id || page){
      tail += `?` + params.toString();
    }
    return this.http
      .get<any>(`${this._liveApiUrl}/company/order-listing/${tail}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
  }
}
