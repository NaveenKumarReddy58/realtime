import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../_service/auth.service';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root',
})
export class LocateDriverService {

    
    _liveApiUrl: any = this.authService._liveApiUrl;
    public app = initializeApp(environment.firebase);
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private toastr: ToastrService,
        private authService: AuthService,
        private firestore: Firestore
    ) {
     }

    getDriversInfo(){
        let collectionList = collection(this.firestore , 'users');
        return collectionData(collectionList);
    }
}