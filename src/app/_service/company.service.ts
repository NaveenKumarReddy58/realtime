import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  _liveApiUrl: any = this.authService._liveApiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  private _company = new BehaviorSubject<object[]>([]);
  private companyData: { company: object[] } = { company: [] };

  private _orgCount = new BehaviorSubject<object[]>([]);
  private orgCountData: { orgCount: object[] } = { orgCount: [] };

  getOrgCount(): Observable<any[]> {
    return this._orgCount.asObservable();
  }

  getCompany(): Observable<any[]> {
    return this._company.asObservable();
  }

  companyAdd(form: any) {
    return this.http
      .post<any>(`${this._liveApiUrl}/tenant/organization/`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  companyList(id?: Number, filter?: any) {
    let tail = '';
    if (id != 0) {
      tail += id;
    }
    let params = new URLSearchParams();
    for (let key in filter) {
      params.set(key, filter[key]);
    }
    if (filter) {
      tail += `?` + params.toString();
    }
    this.http
      .get<any>(`${this._liveApiUrl}/tenant/organization-listing/${tail}`)
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

          this.companyData.company = data;
          this._company.next(Object.assign({}, this.companyData).company);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  companyDetail(companyid: Number) {
    return this.http.get<any>(
      `${this._liveApiUrl}/tenant/organization/${companyid}/`
    );
  }

  companyDelete(id: Number) {
    return this.http.delete<any>(
      `${this._liveApiUrl}/tenant/organization/${id}`
    );
  }

  companyActivateDeactivate(id: Number, org_status: string) {
    return this.http
      .patch<any>(`${this._liveApiUrl}/tenant/organization/${id}/`, {
        org_status,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  orgCount() {
    this.http
      .get<any>(`${this._liveApiUrl}/tenant/org-count/`)
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

          this.orgCountData.orgCount = data;
          this._orgCount.next(Object.assign({}, this.orgCountData).orgCount);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  companyBookmark(id: Number) {
    return this.http
      .put<any>(`${this._liveApiUrl}/tenant/bookmark/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }
}
