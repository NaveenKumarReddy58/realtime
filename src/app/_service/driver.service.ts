import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError, BehaviorSubject, Observable } from 'rxjs';

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

  // first_name:Sandeep
  // last_name:Singh
  // email:flutterguruu@gmail.com
  // password:Admin@123#
  // phone_number:7528943768
  // address:chandigarh
  // is_head_driver:true
  // is_active:true
  // certificates: file

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
      .put<any>(`${this._liveApiUrl}/account/edit-driver/${id}/`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  driverActivateDeactivate(id: Number, status: any) {
    return this.http
      .put<any>(`${this._liveApiUrl}/account/activatedeactivate-driver/${id}`, {
        status,
      })
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
}
