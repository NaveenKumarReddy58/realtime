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
    deleteTicket(id: any) {
        return this.http.delete<any>(`${this._liveApiUrl}/helpdesk/ticket/${id}`).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }

    getTickets(page: any, val:any, status: any, searchVal: any) {
        let tail = '';
        let label= '';
        if(val == "DT"){
            label="driver";
        } else if(val == "CT"){
            label="customer";
        } else if(val == "MT"){
            label="my";
        }
        let params = new URLSearchParams();
        if (params) {
            if (label && label.length > 0) {
                params.set('label', label)
            }
            if (status && status.length > 0) {
                params.set('status', status)
            }
            if(searchVal && searchVal.length > 0){
                params.set('search_text', searchVal)
            }
            if (page) {
                params.set('page', page + 1)
            }
        }
        if(label || status || page || searchVal){
        tail += `?` + params.toString();
        }
        return this.http.get<any>(`${this._liveApiUrl}/helpdesk/ticket-listing/${tail}`).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }
    getTicketsCount() {
        return this.http.get<any>(`${this._liveApiUrl}/helpdesk/ticket-count/`).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }

    getTicketDetails(id: any) {
        return this.http.get<any>(`${this._liveApiUrl}/helpdesk/ticket-datails/${id}`).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }
    sendChat(form:any) {
        return this.http.post<any>(`${this._liveApiUrl}/helpdesk/send-chat/`, form).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }
    getStatusCount(val:any) {
        let created_by='';
        if(val == "DT"){
            created_by="driver";
        } else if(val == "CT"){
            created_by="customer";
        } else if(val == "MT"){
            created_by="my";
        }
        let tail = '';
        let params = new URLSearchParams();
        if (params) {
            if(created_by && created_by.length>0){
                params.set('created_by', created_by)
            }
        }
       if(created_by && created_by.length>0){
        tail += `?` + params.toString();
        }
        return this.http.get<any>(`${this._liveApiUrl}/helpdesk/ticket-status-count/${tail}`).pipe(
            map((data: any) => {
                return data;
            }),
            catchError(this.authService.handleError)
        );
    }
}