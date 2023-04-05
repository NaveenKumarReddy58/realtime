import { Routes } from '@angular/router';
import { FrontGuard } from './_shared/front.guard';

export const CHILDREN_ROUTES: Routes = [
  {
    path: '',
    // component: PreComponent,
    title: 'Home',
    canActivate: [FrontGuard],
    loadComponent: () =>
      import('../app/front/pre/pre.component').then((mod) => mod.PreComponent),
  },
  {
    path: 'login',
    // component: LoginComponent,
    title: 'Login',
    canActivate: [FrontGuard],
    loadComponent: () =>
      import('../app/front/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'reset',
    // component: ResetPasswordComponent,
    title: 'Reset Password',
    canActivate: [FrontGuard],
    loadComponent: () =>
      import('../app/front/reset-password/reset-password.component').then(
        (mod) => mod.ResetPasswordComponent
      ),
  },
  {
    path: 'forgot',
    // component: ForgotPasswordComponent,
    title: 'Forgot Password',
    canActivate: [FrontGuard],
    loadComponent: () =>
      import('../app/front/forgot-password/forgot-password.component').then(
        (mod) => mod.ForgotPasswordComponent
      ),
  },
  {
    path: 'otplogin',
    // component: OtpLoginComponent,
    title: 'OTP Login',
    canActivate: [FrontGuard],
    loadComponent: () =>
      import('../app/front/otp-login/otp-login.component').then(
        (mod) => mod.OtpLoginComponent
      ),
  },
];
