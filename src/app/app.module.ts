import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { PreComponent } from './front/pre/pre.component';
import { LoginComponent } from './front/login/login.component';
import { OtpLoginComponent } from './front/otp-login/otp-login.component';
import { ResetPasswordComponent } from './front/reset-password/reset-password.component';
import { SidebarComponent } from './front/layout/sidebar/sidebar.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { MenuComponent } from './back/layout/menu/menu.component';
import { TopComponent } from './back/layout/top/top.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ForgotPasswordComponent } from './front/forgot-password/forgot-password.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgOtpInputModule } from 'ng-otp-input';
import { ToastrModule } from 'ngx-toastr';
import { TimerComponent } from './timer/timer.component';
import { CountdownModule } from 'ngx-countdown';
import { StoreModule } from '@ngrx/store';
import { AuthInterceptor } from './_shared/authconfig.interceptor';
import { PlanListComponent } from './back/plan-list/plan-list.component';
import { PlanAddComponent } from './back/plan-list/plan-add/plan-add.component';
import { CompanyListComponent } from './back/company-list/company-list.component';
import { CompanyAddComponent } from './back/company-list/company-add/company-add.component';
import { LayoutComponent } from './back/layout/layout/layout.component';
import { TicketListComponent } from './back/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './back/ticket-list/ticket-detail/ticket-detail.component';
import { ProfileComponent } from './back/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    PreComponent,
    LoginComponent,
    OtpLoginComponent,
    ResetPasswordComponent,
    SidebarComponent,
    MenuComponent,
    TopComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    TimerComponent,
    PlanListComponent,
    PlanAddComponent,
    CompanyListComponent,
    CompanyAddComponent,
    LayoutComponent,
    TicketListComponent,
    TicketDetailComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgOtpInputModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    SlickCarouselModule,
    CountdownModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
