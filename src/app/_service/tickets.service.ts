import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { map, catchError, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TicketsService {
    _liveApiUrl: any = this.authService._liveApiUrl;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private toastr: ToastrService,
        public authService: AuthService
    ) { }

    createTicket(form: any) {
        return this.http.post<any>(`${this._liveApiUrl}/helpdesk/ticket/`, form).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }

    getTickets(page: any) {
        let tail = '';
        let params = new URLSearchParams();
        if (params) {
            if(page && page>0){
                params.set('page', page)
            }
        }
       if(page){
        tail += `?` + params.toString();
        }
        return this.http.get<any>(`${this._liveApiUrl}/helpdesk/ticket-listing/${tail}`).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }
}