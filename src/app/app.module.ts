import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AuthInterceptor } from './_shared/auth.interceptor';

import { DateAgo } from './_pipes/date-ago.pipe';
import { DateDifference } from './_pipes/date-difference.pipe';

import { TimerComponent } from './front/timer/timer.component';
import { SplashComponent } from './front/splash/splash.component';
import { ResetPasswordComponent } from './front/reset-password/reset-password.component';
import { PreComponent } from './front/pre/pre.component';
import { OtpLoginComponent } from './front/otp-login/otp-login.component';
import { NotFoundComponent } from './front/not-found/not-found.component';
import { LoginComponent } from './front/login/login.component';
import { SidebarComponent } from './front/layout/sidebar/sidebar.component';
import { ForgotPasswordComponent } from './front/forgot-password/forgot-password.component';
import { PlanAddComponent } from './back/supersuperadmin/plan-list/plan-add/plan-add.component';
import { DialogAnimationsComponent } from './back/common/dialog-animations/dialog-animations.component';
import { PlanListComponent } from './back/supersuperadmin/plan-list/plan-list.component';
import { CompanyAddComponent } from './back/supersuperadmin/company-list/company-add/company-add.component';
import { CompanyDetailComponent } from './back/supersuperadmin/company-list/company-detail/company-detail.component';
import { CompanyListComponent } from './back/supersuperadmin/company-list/company-list.component';
import { WarehouseAddComponent } from './back/superadmin/warehouse-list/warehouse-add/warehouse-add.component';
import { WarehouseListComponent } from './back/superadmin/warehouse-list/warehouse-list.component';
import { OrderAddComponent } from './back/superadmin/order-list/order-add/order-add.component';
import { OrderDetailComponent } from './back/superadmin/order-list/order-detail/order-detail.component';
import { OrderListComponent } from './back/superadmin/order-list/order-list.component';
import { LocateDriverComponent } from './back/superadmin/locate-driver/locate-driver.component';
import { DriverAddComponent } from './back/superadmin/driver-list/driver-add/driver-add.component';
import { DriverListComponent } from './back/superadmin/driver-list/driver-list.component';
import { AddressAddComponent } from './back/superadmin/address-list/address-add/address-add.component';
import { AddressListComponent } from './back/superadmin/address-list/address-list.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { TicketDetailComponent } from './back/common/ticket-list/ticket-detail/ticket-detail.component';
import { TicketListComponent } from './back/common/ticket-list/ticket-list.component';
import { SettingComponent } from './back/common/setting/setting.component';
import { ProfileComponent } from './back/common/profile/profile.component';
import { TopComponent } from './back/common/layout/top/top.component';
import { MenuComponent } from './back/common/layout/menu/menu.component';
import { SuperAdminComponent } from './back/superadmin/super-admin.component';
import { SuperSuperAdminComponent } from './back/supersuperadmin/super-super-admin.component';
import { NotificationListComponent } from './back/common/notification-list/notification-list.component';
import { Select2Module } from 'ng-select2-component';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { StoreModule } from '@ngrx/store';
import { NgOtpInputModule } from 'ng-otp-input';
import { CountdownModule } from 'ngx-countdown';
import { MomentModule } from 'ngx-moment';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { GoogleMapsModule } from '@angular/google-maps';
import { DriverDetailsComponent } from './back/superadmin/driver-list/driver-details/driver-details.component';
import {MatSelectModule} from '@angular/material/select';
import { DriverOrdersListComponent } from './back/superadmin/driver-list/driver-orders-list/driver-orders-list.component';
import { ReusableGoogleMapComponent } from './reusable-google-map/reusable-google-map.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FirebaseAppModule,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase, DatabaseModule } from '@angular/fire/database';
import { provideFirestore,getFirestore, FirestoreModule } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging, MessagingModule } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { initializeApp } from "firebase/app";
import { PublicCompanyRegistrationComponent } from './public-company-registration/public-company-registration.component';
initializeApp(environment.firebase);

@NgModule({
  declarations: [
    DateAgo,
    DateDifference,
    AppComponent,
    TimerComponent,
    SplashComponent,
    ResetPasswordComponent,
    PreComponent,
    OtpLoginComponent,
    NotFoundComponent,
    LoginComponent,
    SidebarComponent,
    ForgotPasswordComponent,
    PlanAddComponent,
    DialogAnimationsComponent,
    PlanListComponent,
    CompanyAddComponent,
    CompanyDetailComponent,
    CompanyListComponent,
    WarehouseAddComponent,
    WarehouseListComponent,
    OrderAddComponent,
    OrderDetailComponent,
    OrderListComponent,
    LocateDriverComponent,
    DriverAddComponent,
    DriverListComponent,
    AddressAddComponent,
    AddressListComponent,
    DashboardComponent,
    TicketDetailComponent,
    TicketListComponent,
    SettingComponent,
    ProfileComponent,
    TopComponent,
    MenuComponent,
    SuperAdminComponent,
    SuperSuperAdminComponent,
    NotificationListComponent,
    DriverDetailsComponent,
    DriverOrdersListComponent,
    ReusableGoogleMapComponent,
    PublicCompanyRegistrationComponent,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    CommonModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgOtpInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SlickCarouselModule,
    CountdownModule,
    StoreModule.forRoot({}, {}),
    CdkAccordionModule,
    MatDialogModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    MatSelectCountryModule.forRoot('en'),
    Select2Module,
    GoogleMapsModule,
    MatSelectModule,
    MatPaginatorModule,
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
