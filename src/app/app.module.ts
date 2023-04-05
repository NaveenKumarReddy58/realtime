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

@NgModule({
  declarations: [DateAgo],
  imports: [
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
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [],
})
export class AppModule {}
