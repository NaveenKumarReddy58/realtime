import { NgModule } from '@angular/core';

import { AuthInterceptor } from './_shared/auth.interceptor';

import { DateAgo } from './_pipes/date-ago.pipe';
import { DateDifference } from './_pipes/date-difference.pipe';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgOtpInputModule } from 'ng-otp-input';
import { ToastrModule } from 'ngx-toastr';
import { CountdownModule } from 'ngx-countdown';
import { StoreModule } from '@ngrx/store';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDialogModule } from '@angular/material/dialog';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'ngx-moment';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
import { DialogAnimationsComponent } from './back/supersuperadmin/plan-list/dialog-animations/dialog-animations.component';
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
import { AppComponent } from './app.component';
import { SuperAdminComponent } from './back/superadmin/super-admin.component';
import { SuperSuperAdminComponent } from './back/supersuperadmin/super-super-admin.component';
import { NotificationListComponent } from './back/common/notification-list/notification-list.component';

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
  ],
  imports: [
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
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
