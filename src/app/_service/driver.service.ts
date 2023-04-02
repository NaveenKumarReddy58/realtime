import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs';

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

  driverActivateDeactivate(id: Number, status: boolean) {
    return this.http
      .put<any>(
        `${this._liveApiUrl}/account/activatedeactivate-driver/${id}/`,
        {
          status,
        }
      )
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

  driverList() {
    return this.http.get<any>(`${this._liveApiUrl}/account/driver-listing/`);
  }

  driverDetail(id: Number) {
    return this.http.get<any>(
      `${this._liveApiUrl}/account/delete-driver/${id}/`
    );
  }
}
