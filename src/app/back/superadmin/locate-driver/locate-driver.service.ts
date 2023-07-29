import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../_service/auth.service';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
// import { Firestore, collectionData, getDocs } from '@angular/fire/firestore';
import { Firestore, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592


// Initialize Firebase
const app = initializeApp(environment.firebase);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

@Injectable({
    providedIn: 'root',
})
export class LocateDriverService {


    _liveApiUrl: any = this.authService._liveApiUrl;
    public driverData: any = [];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private toastr: ToastrService,
        private authService: AuthService,
    ) {
    }

    async getDriversInfo() {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            this.driverData.push(doc.data())
        });
        return this.driverData;
    }
}