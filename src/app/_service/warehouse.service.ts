import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  _liveApiUrl: any = this.authService._liveApiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  private _warehouse = new BehaviorSubject<object[]>([]);
  private warehouseData: { warehouse: object[] } = { warehouse: [] };

  getWarehouse(): Observable<any[]> {
    return this._warehouse.asObservable();
  }

  // warehouse_name:Warehouse-1
  // address:2
  // contact_name:Sandeep singh
  // email:sandeep@gmail.com
  // phone:+919646646757
  // alt_phone:+919646646757
  // is_main_localation:true

  warehouseAdd(form: any) {
    return this.http
      .post<any>(`${this._liveApiUrl}/company/add-warehouse/`, form)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  warehouseEdit(id: Number, form: any) {
    return this.http
      .put<any>(`${this._liveApiUrl}/company/update-warehouse/${id}/`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  warehouseList(id?: Number) {
    let tail = '';
    if (id) {
      tail = `${id}`;
    }

    this.http
      .get<any>(`${this._liveApiUrl}/company/get-warehouse/${tail}`)
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

          this.warehouseData.warehouse = data;
          this._warehouse.next(Object.assign({}, this.warehouseData).warehouse);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  warehouseDelete(id: any) {
    return this.http.delete<any>(
      `${this._liveApiUrl}/company/delete-warehouse/${id}`
    );
  }

  warehouseSet(id: Number) {
    return this.http
      .patch<any>(`${this._liveApiUrl}/company/make-default/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }
}
