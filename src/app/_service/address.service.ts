import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  _liveApiUrl: any = this.authService._liveApiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  private _address = new BehaviorSubject<object[]>([]);
  private addressData: { address: object[] } = { address: [] };

  getAddress(): Observable<any[]> {
    return this._address.asObservable();
  }

  // address:Sector 17 Chandigarh
  // lattitude:30.741482
  // longitute:76.768066

  addressAdd(form: any) {
    return this.http
      .post<any>(`${this._liveApiUrl}/company/add-address/`, form)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  addressSearch(adr?: string) {
    let tail = '';
    if (adr) {
      tail = `${adr}`;
    }

    this.http
      .get<any>(`${this._liveApiUrl}/company/search-address/?adr=${tail}`)
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

          this.addressData.address = data;
          this._address.next(Object.assign({}, this.addressData).address);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  addressDelete(id: any) {
    return this.http.delete<any>(
      `${this._liveApiUrl}/company/delete-address/${id}`
    );
  }
}
